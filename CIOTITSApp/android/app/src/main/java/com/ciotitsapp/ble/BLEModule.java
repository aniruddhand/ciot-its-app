package com.ciotitsapp.ble;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothProfile;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class BLEModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "BLEModule";

    private static final String EVENT_CONN_STATUS_CHANGE = "ConnectionStatusChange";
    private static final String EVENT_VEHICLE_STATUS_CHANGE = "VehicleStatusChange";

    private static final String RPI_MAC_ADDRESS = "DC:A6:32:B6:67:13";
    private static final String VSS_UUID = "0f7d0ee7-ab1f-47cf-93ed-9ef8038f8bec";
    private static final String VSC_UUID = "0f7d0ee8-ab1f-47cf-93ed-9ef8038f8bec";
    public static final String CHR_CONFIG_DESC_UUID = "00002902-0000-1000-8000-00805f9b34fb";

    private BluetoothAdapter defaultAdapter;
    private BluetoothGatt bluetoothGatt;
    private BluetoothGattDescriptor charConfigDesc;

    private boolean connected;
    private boolean connectionClosedByUser;

    public BLEModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    /**
     * Connects to the vehicle by scanning for device with specific MAC ID
     *
     * Scanning does loop for ever. It scans for 2s and if not found then
     * sets appropriate error code in the Callback.
     *
     * @param failureCallback Callback invoked when connection with vehicle could not be made
     * @param successCallback Callback invoked when connection with vehicle could be made
     */
    @ReactMethod
    public void connectToVehicle(Callback failureCallback, Callback successCallback) {
        Log.i(MODULE_NAME, "Checking bluetooth settings...");

        if (defaultAdapter == null) {
            defaultAdapter = BluetoothAdapter.getDefaultAdapter();
        }

        if (defaultAdapter == null) {
            String errorMsg = "Bluetooth adapter not found!";
            Log.e(MODULE_NAME, errorMsg);

            failureCallback.invoke(errorMsg);
        }

        connectToBleServerAndEnableNotifications();
        //successCallback.invoke(true);
    }

    @ReactMethod
    public void disconnectFromVehicle() {
        if (bluetoothGatt != null) {
            connectionClosedByUser = true;
            connected = false;

            setNotificationsEnabled(false);

            bluetoothGatt.disconnect();
            //bluetoothGatt.close();

            bluetoothGatt = null;
            charConfigDesc = null;
        }
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("CONN_STATUS_EVENT", EVENT_CONN_STATUS_CHANGE);
        constants.put("VEHICLE_STATUS_EVENT", EVENT_VEHICLE_STATUS_CHANGE);

        return constants;
    }

    private void connectToBleServerAndEnableNotifications() {
        Log.i(MODULE_NAME, "Bluetooth adapter exists. Connecting with vehicle...");

        final BluetoothDevice piDevice = defaultAdapter
                .getRemoteDevice(RPI_MAC_ADDRESS);
        final ReactApplicationContext context = getReactApplicationContext();

        bluetoothGatt = piDevice.connectGatt(context, false,
                new VehicleStatusCallback(), BluetoothDevice.TRANSPORT_LE);
    }

    private void setNotificationsEnabled(boolean enabled) {
        if (charConfigDesc == null) {
            return;
        }

        charConfigDesc.setValue(
                enabled ? BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                        : BluetoothGattDescriptor.DISABLE_NOTIFICATION_VALUE);
        bluetoothGatt.writeDescriptor(charConfigDesc);
    }

    private class VehicleStatusCallback extends BluetoothGattCallback {
        private final DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter;

        public VehicleStatusCallback() {
            ReactApplicationContext context = getReactApplicationContext();
            eventEmitter = context
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }

        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            super.onConnectionStateChange(gatt, status, newState);

            if (newState == BluetoothProfile.STATE_CONNECTED) {
                connected = true;

                Log.i(MODULE_NAME, "Connected to ITS BLE server, discovering services...");
                eventEmitter.emit(EVENT_CONN_STATUS_CHANGE, "discovering");

                // Connected to the server, now discover services
                gatt.discoverServices();

            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                if (connected) {
                    Log.i(MODULE_NAME, MessageFormat.format("Disconnected from ITS " +
                            "BLE server... connectionClosedByUser: {0}", connectionClosedByUser));
                    if (connectionClosedByUser) {
                        eventEmitter.emit(EVENT_CONN_STATUS_CHANGE, "disconnected");
                    }
                } else {
                    Log.i(MODULE_NAME, "Could not connect to ITS BLE server...");
                    eventEmitter.emit(EVENT_CONN_STATUS_CHANGE, "failed");
                }

                gatt.close();
            }
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            super.onServicesDiscovered(gatt, status);

            Log.d(MODULE_NAME, "Discovered services...");
            eventEmitter.emit(EVENT_CONN_STATUS_CHANGE, "connected");

            BluetoothGattService statusService = gatt.getService(UUID.fromString(VSS_UUID));
            if (statusService == null) {
                Log.e(MODULE_NAME, "Vehicle status service not found!");
                return;
            }

            Log.d(MODULE_NAME, "Fetched vehicle status service");
            BluetoothGattCharacteristic statusCh = statusService.getCharacteristic(
                    UUID.fromString(VSC_UUID));

            if (statusCh == null) {
                Log.e(MODULE_NAME, "Vehicle status characteristic not found!");
                return;
            }

            Log.d(MODULE_NAME, "Fetched vehicle status character");
            if (!gatt.setCharacteristicNotification(statusCh, true)) {
                Log.e(MODULE_NAME, "Could not enable notifications for" +
                        " vehicle status characteristic!");
                return;
            }

            charConfigDesc = statusCh.getDescriptor(UUID
                    .fromString(CHR_CONFIG_DESC_UUID));

            if (charConfigDesc != null) {
                setNotificationsEnabled(true);
                Log.d(MODULE_NAME, "Enabled notifications for vehicle status");
            }
        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic
                characteristic) {
            super.onCharacteristicChanged(gatt, characteristic);

            final String updatedVales = characteristic.getStringValue(0);
            Log.d(MODULE_NAME, "Received vehicle status change notification from " +
                    "Gatt server: " + updatedVales);

            eventEmitter.emit(EVENT_VEHICLE_STATUS_CHANGE, updatedVales);
        }
    }
}
