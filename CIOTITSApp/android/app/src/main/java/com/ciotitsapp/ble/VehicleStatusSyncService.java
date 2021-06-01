package com.ciotitsapp.ble;

import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

import java.text.MessageFormat;

public class VehicleStatusSyncService extends Service {
    private Binder binder = new LocalBinder();

//    private BluetoothAdapter defaultAdapter;
//    private BluetoothGatt bluetoothGatt;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

//    public void connectAndGetNotifications() {
//        defaultAdapter = BluetoothAdapter.getDefaultAdapter();
//
//        final BluetoothDevice piDevice = defaultAdapter.getRemoteDevice("DC:A6:32:B6:67:13");
//        final Context context = getApplicationContext();
//
//        bluetoothGatt = piDevice.connectGatt(context, false, new BluetoothGattCallback() {
//            @Override
//            public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
//                super.onConnectionStateChange(gatt, status, newState);
//
//                if (newState == BluetoothProfile.STATE_CONNECTED) {
//
//                } else if (newState == BluetoothProfile.STATE_DISCONNECTED
//                        && !connectionClosedByUser) {
//
//                }
//            }
//
//            @Override
//            public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
//                super.onCharacteristicChanged(gatt, characteristic);
//                Log.i(MODULE_NAME, MessageFormat.format("Characteristic changed, " +
//                                "new value: ",
//                        characteristic.getStringValue(0)));
//            }
//        });
//
///*            BluetoothLeScanner leScanner = defaultAdapter.getBluetoothLeScanner();
//
//            // DC:A6:32:B6:67:13
//            ScanCallback scanCallback = new ScanCallback() {
//                @Override
//                public void onScanResult(int callbackType, ScanResult result) {
//                    super.onScanResult(callbackType, result);
//                    Log.i(MODULE_NAME, MessageFormat.format("Device name: {0}, H/W Address: {1}",
//                            result.getDevice().getName(), result.getDevice().getAddress()));
//                }
//            };
//
//            new Handler().postDelayed(() -> leScanner.stopScan(scanCallback), 10000);
//
//            ScanFilter hardwareAddressFilter = new ScanFilter.Builer();
//
//            leScanner.startScan(scanCallback);*/
//    }

    private class LocalBinder extends Binder {
        public VehicleStatusSyncService getService() {
            return VehicleStatusSyncService.this;
        }
    }
}
