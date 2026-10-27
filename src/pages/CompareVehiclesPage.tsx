import React from 'react';
import { Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Plus,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { VEHICLES_DATA } from '../data/seedData';
import { VehicleItem } from '../types';

export const CompareVehiclesPage: React.FC = () => {
  const { comparedVehicleIds, removeVehicleFromCompare, addVehicleToCompare, clearCompare, maxVehicles } = useCompare();

  const vehicles = comparedVehicleIds
    .map((id) => VEHICLES_DATA.find((v) => v.id === id || v.modelSlug === id))
    .filter(Boolean) as VehicleItem[];

  const availableVehiclesToAdd = VEHICLES_DATA.filter(
    (v) => !comparedVehicleIds.includes(v.id) && !comparedVehicleIds.includes(v.modelSlug)
  );

  return (
    <div className="bg-[#F0F4F8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link to="/" className="hover:text-gray-900">Home</Link>
              <span>/</span>
              <Link to="/vehicles" className="hover:text-gray-900">Electric Vehicles</Link>
              <span>/</span>
              <span className="font-semibold text-[#14532D]">Compare Vehicles</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Vehicle Comparison Matrix
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Side-by-side technical and commercial benchmarking of up to {maxVehicles} electric vehicles.
            </p>
          </div>

          {vehicles.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 self-start"
            >
              <X className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300 max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#14532D] flex items-center justify-center mx-auto">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">No Vehicles Selected for Comparison</h2>
            <p className="text-xs text-gray-500">
              Browse our vehicle catalog and click the compare icon on cards to benchmark specifications side-by-side.
            </p>
            <Link
              to="/vehicles"
              className="inline-block px-6 py-2.5 bg-[#14532D] hover:bg-[#0d381e] text-white text-xs font-bold rounded-xl shadow-premium"
            >
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto pb-6">
            <table className="w-full min-w-[700px] border-collapse bg-white rounded-3xl shadow-subtle border border-gray-200 overflow-hidden">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4 w-48 text-left text-xs font-bold text-gray-400 uppercase bg-gray-50/70">
                    Vehicle Model
                  </th>
                  {vehicles.map((v) => (
                    <th key={v.id} className="p-4 text-left w-64 align-top border-l border-gray-100 relative">
                      <button
                        onClick={() => removeVehicleFromCompare(v.id)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-rose-600 p-1 rounded-full hover:bg-gray-100"
                        title="Remove vehicle"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <img src={v.images[0].url} alt={v.name} className="w-full h-32 object-cover rounded-2xl mb-3" />
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">{v.brand}</span>
                      <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">{v.name}</h3>
                      <span className="text-base font-black text-[#14532D] block mb-3">
                        ₹{v.exShowroomPrice.toLocaleString('en-IN')}
                      </span>

                      <div className="flex flex-col gap-1.5">
                        <Link
                          to={`/checkout/vehicle/${v.modelSlug}`}
                          className="w-full py-2 bg-[#14532D] hover:bg-[#0d381e] text-white text-[11px] font-bold rounded-xl text-center shadow-sm"
                        >
                          Buy Now
                        </Link>
                        <Link
                          to={`/test-drive?vehicle=${v.id}`}
                          className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#14532D] text-[11px] font-bold rounded-xl text-center"
                        >
                          Book Test Drive
                        </Link>
                      </div>
                    </th>
                  ))}

                  {/* Add more vehicle column slot if < 4 */}
                  {vehicles.length < maxVehicles && (
                    <th className="p-4 w-48 align-middle border-l border-gray-100 bg-gray-50/40 text-center">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-gray-500 block">Add to Compare</span>
                        <select
                          onChange={(e) => {
                            if (e.target.value) addVehicleToCompare(e.target.value);
                          }}
                          className="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white font-semibold"
                          defaultValue=""
                        >
                          <option value="" disabled>Select vehicle...</option>
                          {availableVehiclesToAdd.map((av) => (
                            <option key={av.id} value={av.id}>{av.name}</option>
                          ))}
                        </select>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs">
                {/* 1. Price */}
                <tr className="bg-gray-50/40">
                  <td className="p-3.5 font-bold text-gray-700">Ex-Showroom Price</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3.5 border-l border-gray-100 font-bold text-gray-900">
                      ₹{v.exShowroomPrice.toLocaleString('en-IN')}
                    </td>
                  ))}
                  {vehicles.length < maxVehicles && <td className="border-l border-gray-100"></td>}
                </tr>

                {/* 2. Vehicle Category */}
                <tr>
                  <td className="p-3.5 font-bold text-gray-700">Category</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3.5 border-l border-gray-100 text-gray-800">
                      {v.category.replace(/_/g, ' ')}
                    </td>
                  ))}
                  {vehicles.length < maxVehicles && <td className="border-l border-gray-100"></td>}
                </tr>

                {/* 3. Range per Charge */}
                <tr className="bg-gray-50/40">
                  <td className="p-3.5 font-bold text-gray-700">Certified Range (IDC)</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3.5 border-l border-gray-100 font-bold text-emerald-700">
                      {v.certifiedRangeKm} km
                    </td>
                  ))}
                  {vehicles.length < maxVehicles && <td className="border-l border-gray-100"></td>}
                </tr>

                {/* 4. Battery Capacity */}
                <tr>
                  <td className="p-3.5 font-bold text-gray-700">Battery Capacity</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3.5 border-l border-gray-100 text-gray-800 font-semibold">
                      {v.batteryCapacityKwh} kWh
                    </td>
                  ))}
                  {vehicles.length < maxVehicles && <td className="border-l border-gray-100"></td>}
                </tr>

                {/* 5. Charging Time */}
                <tr className="bg-gray-50/40">
                  <td className="p-3.5 font-bold text-gray-700">Charging Time (Home)</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3.5 border-l border-gray-100 text-gray-800">
                      {v.chargingTimeHours} hours
                    </td>
                  ))}
                  {vehicles.length < maxVehicles && <td className="border-l border-gray-100"></td>}
                </tr>

                {/* 6. Maximum Speed */}
                <tr>
                  <td className="p-3.5 font-bold text-gray-700">Top Speed</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3.5 border-l border-gray-100 text-gray-800 font-semibold">
                      {v.topSpeedKmph} km/h
                    </td>
                  ))}
                  {vehicles.length < maxVehicles && <td className="border-l border-gray-100"></td>}
                </tr>

                {/* 7. Motor Power */}
                <tr className="bg-gray-50/40">
                  <td className="p-3.5 font-bold text-gray-700">Peak Motor Power</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3.5 border-l border-gray-100 text-gray-800">
                      {(v.motorPowerWatts / 1000).toFixed(1)} kW ({v.motorType})
                    </td>
                  ))}
                  {vehicles.length < maxVehicles && <td className="border-l border-gray-100"></td>}
                </tr>

                {/* 8. Payload / Seating */}
                <tr>
                  <td className="p-3.5 font-bold text-gray-700">Capacity / Usage</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3.5 border-l border-gray-100 text-gray-800">
                      {v.usageType}
                    </td>
                  ))}
                  {vehicles.length < maxVehicles && <td className="border-l border-gray-100"></td>}
                </tr>

                {/* 9. Warranty */}
                <tr className="bg-gray-50/40">
                  <td className="p-3.5 font-bold text-gray-700">Battery Warranty</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3.5 border-l border-gray-100 text-gray-800">
                      {v.warrantyYears} Years / {v.warrantyKm / 1000}k km
                    </td>
                  ))}
                  {vehicles.length < maxVehicles && <td className="border-l border-gray-100"></td>}
                </tr>

                {/* 10. Availability */}
                <tr>
                  <td className="p-3.5 font-bold text-gray-700">Delivery Status</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3.5 border-l border-gray-100">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {v.inStock ? 'Ready for Dispatch' : 'Waitlist 2-3 Weeks'}
                      </span>
                    </td>
                  ))}
                  {vehicles.length < maxVehicles && <td className="border-l border-gray-100"></td>}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
