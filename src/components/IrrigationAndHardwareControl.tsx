import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Thermometer, 
  Droplets,
  Sun,
  Moon,
  Play,
  Pause,
  Wifi,
  WifiOff,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useIrrigationStore } from '@/lib/settings';
import IrrigationScheduleManager from './IrrigationScheduleManager';

const IrrigationAndHardwareControl = () => {
  const [showScheduleManager, setShowScheduleManager] = useState(false);
  const {
    temperature,
    optimalTemperature,
    isAutoTemp,
    isMotorRunning,
    zones,
    motorSpeed,
    fanSpeed,
    setTemperature,
    setOptimalTemperature,
    setIsAutoTemp,
    setIsMotorRunning,
    setMotorSpeed,
    setFanSpeed
  } = useIrrigationStore();

  return (
    <div className="space-y-6">
      {/* Temperature and Motor Control */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Kontrola temperature plastenika</h3>
        </div>

        {/* Mode Selection Banner - Moved here */}
        <div className="mb-6 p-4 rounded-lg border bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h4 className="font-medium text-gray-900">Režim rada ventilatora</h4>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setIsAutoTemp(false)}
                className={`px-4 py-2 rounded-lg border border-gray-900 transition-colors ${
                  !isAutoTemp 
                    ? 'bg-gray-900 text-white'
                    : 'bg-transparent text-gray-900'
                }`}
              >
                {!isAutoTemp ? 'ON - Ručno' : 'OFF - Ručno'}
              </button>
              <button
                onClick={() => setIsAutoTemp(true)}
                className={`px-4 py-2 rounded-lg border border-gray-900 transition-colors ${
                  isAutoTemp 
                    ? 'bg-gray-900 text-white'
                    : 'bg-transparent text-gray-900'
                }`}
              >
                {isAutoTemp ? 'ON - Automatski' : 'OFF - Automatski'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Temperature Control */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Thermometer className="h-5 w-5 text-red-500" />
              <div>
                <h4 className="font-medium text-gray-900">Trenutna temperatura: {temperature}°C</h4>
                <p className="text-sm text-gray-600">Optimalna temperatura: {optimalTemperature}°C</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsAutoTemp(!isAutoTemp)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  isAutoTemp ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {isAutoTemp ? 'Automatski' : 'Ručno'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optimalna temperatura (°C)
              </label>
              <Slider
                value={[optimalTemperature]}
                onValueChange={handleTemperatureChange}
                min={15}
                max={35}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">15°C</span>
                <span className="text-xs text-gray-500">{optimalTemperature}°C</span>
                <span className="text-xs text-gray-500">35°C</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brzina motora (PWM)
              </label>
              <Slider
                value={[motorSpeed]}
                onValueChange={handleMotorSpeedChange}
                min={0}
                max={255}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">0</span>
                <span className="text-xs text-gray-500">{motorSpeed}</span>
                <span className="text-xs text-gray-500">255</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {isAutoTemp && (
                  temperature > optimalTemperature
                    ? `Ventilator je uključen jer je temperatura (${temperature}°C) iznad optimalne (${optimalTemperature}°C)`
                    : `Ventilator je isključen jer je temperatura (${temperature}°C) u granicama optimalne (${optimalTemperature}°C)`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Irrigation Schedule */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upravljanje rasporedom navodnjavanja</h3>
        <button 
          onClick={() => setShowScheduleManager(true)} 
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-6"
        >
          <Settings className="h-4 w-4" />
          <span>Podešavanja</span>
        </button>

        {/* Irrigation Zones */}
        <div className="space-y-4">
          {zones.map((zone) => (
            <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    zone.status === 'active' ? 'bg-green-100 text-green-800' :
                    zone.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {zone.status === 'active' ? 'Aktivno' :
                     zone.status === 'scheduled' ? 'Zakazano' :
                     'Neaktivno'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span className="block font-medium">Poslednji ciklus</span>
                  <span>{zone.lastRun}</span>
                </div>
                <div>
                  <span className="block font-medium">Sledeći ciklus</span>
                  <span>{zone.nextRun}</span>
                </div>
                <div>
                  <span className="block font-medium">Trajanje</span>
                  <span>{zone.duration} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Manager Modal */}
      {showScheduleManager && (
        <IrrigationScheduleManager onClose={() => setShowScheduleManager(false)} />
      )}
    </div>
  );
};

export default IrrigationAndHardwareControl;