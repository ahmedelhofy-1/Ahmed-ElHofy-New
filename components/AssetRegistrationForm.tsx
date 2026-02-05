
import React, { useState } from 'react';
import { Save, X, ArrowLeft, Info, FileText, Clipboard, MapPin, Settings } from 'lucide-react';
import { AssetStatus } from '../types';

interface AssetRegistrationFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const AssetRegistrationForm: React.FC<AssetRegistrationFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    itemDescription: '',
    modelBrand: '',
    code: '',
    itemCode: '',
    mainGroup: '',
    subGroup: '',
    currentLocation: '',
    localId: '',
    serialChassis: '',
    serviceStatus: AssetStatus.OPERATIONAL,
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 bg-white sticky top-0 z-20 px-2 -mx-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Technical Asset</h2>
            <p className="text-xs text-gray-500 font-medium">Internal Reference: NEW_ASSET_PROC</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Discard
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
          >
            <Save size={16} />
            Save & Sync
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Data Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded border border-gray-200 sap-shadow overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">General Information (بيانات البند)</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Item Description (وصف البند) *</label>
                <input 
                  type="text" 
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Enter full asset description..."
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Model / Brand (الطراز / الماركة) *</label>
                <input 
                  type="text" 
                  name="modelBrand"
                  value={formData.modelBrand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Manufacturer name and model..."
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Code (كود)</label>
                <input 
                  type="text" 
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="System integration code..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Item Code (البند)</label>
                <input 
                  type="text" 
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Inventory item mapping code..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded border border-gray-200 sap-shadow overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
              <Settings size={16} className="text-emerald-600" />
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Categorization (التصنيف الفني)</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Main Group (المجموعة الرئيسية)</label>
                <select 
                  name="mainGroup"
                  value={formData.mainGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Category...</option>
                  <option value="Vehicles">Vehicles (المركبات)</option>
                  <option value="Irrigation">Irrigation (الري)</option>
                  <option value="Tools">Tools (المعدات)</option>
                  <option value="Facilities">Facilities (المنشآت)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Sub-Group (المجموعة الفرعية)</label>
                <select 
                  name="subGroup"
                  value={formData.subGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Sub-Category...</option>
                  <option value="Tractors">Tractors</option>
                  <option value="Pumps">Pumps</option>
                  <option value="Engines">Engines</option>
                  <option value="Sensors">Sensors</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Current Location (الموقع الحالي)</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Physical storage or functional location..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Data Section */}
        <div className="space-y-6">
          <div className="bg-white rounded border border-gray-200 sap-shadow overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
              <Clipboard size={16} className="text-purple-600" />
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Technical Specs (البيانات الفنية)</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Local ID (الرقم المحلى)</label>
                <input 
                  type="text" 
                  name="localId"
                  value={formData.localId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-blue-50/30"
                  placeholder="Internal inventory number..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Serial / Chassis (مسلسل الإنتاج / رقم الشاسية)</label>
                <input 
                  type="text" 
                  name="serialChassis"
                  value={formData.serialChassis}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="VIN or Manufacturer Serial..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Service Status (موقف الخدمة)</label>
                <select 
                  name="serviceStatus"
                  value={formData.serviceStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  {Object.values(AssetStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded border border-gray-200 sap-shadow overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
              <Info size={16} className="text-gray-600" />
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Notes (الملاحظات 1)</h3>
            </div>
            <div className="p-4">
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                placeholder="Additional technical details or history..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetRegistrationForm;
