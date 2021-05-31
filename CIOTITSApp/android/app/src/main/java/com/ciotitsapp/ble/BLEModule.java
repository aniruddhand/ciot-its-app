package com.ciotitsapp.ble;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.os.Handler;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.text.MessageFormat;

public class BLEModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "BLEModule";

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

        BluetoothAdapter defaultAdapter = BluetoothAdapter.getDefaultAdapter();

        if (defaultAdapter == null) {
            String errorMsg = "Bluetooth adapter not found!";
            Log.e(MODULE_NAME, errorMsg);

            failureCallback.invoke(errorMsg);
        } else {
            Log.i(MODULE_NAME, "Bluetooth adapter exists. Scanning for BLE devices for 10 secs...");
            BluetoothLeScanner leScanner = defaultAdapter.getBluetoothLeScanner();

            // DC:A6:32:B6:67:13
            ScanCallback scanCallback = new ScanCallback() {
                @Override
                public void onScanResult(int callbackType, ScanResult result) {
                    super.onScanResult(callbackType, result);
                    Log.i(MODULE_NAME, MessageFormat.format("Device name: {0}, H/W Address: {1}",
                            result.getDevice().getName(), result.getDevice().getAddress()));
                }
            };

            new Handler().postDelayed(() -> leScanner.stopScan(scanCallback), 10000);

            leScanner.startScan(scanCallback);
        }
    }
}
