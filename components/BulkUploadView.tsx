
import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Upload, Download, FileSpreadsheet, 
  CheckCircle2, AlertCircle, Trash2, Save,
  Info, FileText, ClipboardCheck, Loader2
} from 'lucide-react';
import { AssetStatus } from '../types';

interface BulkUploadViewProps {
  onCancel: () => void;
  onUpload: (data: any[]) => void;
}

const TEMPLATE_HEADERS = [
  "Item Description (وصف البند)",
  "Model Brand (الطراز / الماركة)",
  "Code (كود)",
  "Item Code (البند)",
  "Main Group (المجموعة الرئيسية)",
  "Sub Group (المجموعة الفرعية)",
  "Current Location (الموقع الحالي)",
  "Local ID (الرقم المحلى)",
  "Serial Chassis (رقم الشاسية)",
  "Service Status (موقف الخدمة)",
  "Notes (الملاحظات 1)"
];

const BulkUploadView: React.FC<BulkUploadViewProps> = ({ onCancel, onUpload }) => {
  const [stagedData, setStagedData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + TEMPLATE_HEADERS.join(",") + "\n" +
      "Tractor 8R 410,John Deere,JD-001,ITEM-8R,Vehicles,Tractors,North Farm,L-001,SN-12345,Operational,Initial Bulk Upload\n" +
      "Pivot Pump S4,Grundfos,PMP-001,ITEM-PMP,Irrigation,Pumps,Sector 4,L-002,SN-54321,Standby,Main Pump backup";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Daltex_Asset_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n');
      const data = rows.slice(1).filter(row => row.trim() !== '').map(row => {
        const columns = row.split(',');
        return {
          itemDescription: columns[0]?.trim(),
          modelBrand: columns[1]?.trim(),
          code: columns[2]?.trim(),
          itemCode: columns[3]?.trim(),
          mainGroup: columns[4]?.trim(),
          subGroup: columns[5]?.trim(),
          currentLocation: columns[6]?.trim(),
          localId: columns[7]?.trim(),
          serialChassis: columns[8]?.trim(),
          serviceStatus: columns[9]?.trim() || AssetStatus.OPERATIONAL,
          notes: columns[10]?.trim(),
          isValid: !!columns[0] && !!columns[1] // Basic validation for required fields
        };
      });
      
      setStagedData(data);
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const removeRow = (index: number) => {
    setStagedData(prev => prev.filter((_, i) => i !== index));
  };

  const submitBulk = () => {
    const validData = stagedData.filter(d => d.isValid);
    if (validData.length === 0) {
      alert("No valid records to upload.");
      return;
    }
    onUpload(validData);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 bg-white sticky top-0 z-20 px-2 -mx-2">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bulk Asset Registration</h2>
            <p className="text-xs text-gray-500 font-medium tracking-tight uppercase">Process: MASS_ASSET_UPLOAD_V2</p>
          </div>
        </div>
        <div className="flex gap-2">
          {stagedData.length > 0 && (
            <button 
              onClick={submitBulk}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
            >
              <Save size={16} />
              Synchronize {stagedData.length} Records
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Step Instructions */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 sap-shadow">
            <h3 className="text-xs font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
              <ClipboardCheck size={16} className="text-blue-600" />
              Upload Workflow
            </h3>
            <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-blue-200 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
                <p className="text-xs font-bold text-gray-900">1. Download Template</p>
                <p className="text-[10px] text-gray-500 mt-1">Get the standard Excel/CSV structure for registration.</p>
                <button 
                  onClick={downloadTemplate}
                  className="mt-3 flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase hover:underline"
                >
                  <Download size={12} /> Download CSV Template
                </button>
              </div>

              <div className="relative pl-6 border-l-2 border-blue-200 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
                <p className="text-xs font-bold text-gray-900">2. Prepare Data</p>
                <p className="text-[10px] text-gray-500 mt-1">Fill the sheet with your asset fleet details. Ensure mandatory fields are filled.</p>
              </div>

              <div className="relative pl-6 border-l-2 border-gray-200">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${stagedData.length > 0 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <p className="text-xs font-bold text-gray-900">3. Upload & Validate</p>
                <p className="text-[10px] text-gray-500 mt-1">Drop your file below to preview and validate before ERP sync.</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all"
                >
                  <Upload size={14} /> Select Asset File
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".csv,.xlsx"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
             <span className="shrink-0"><Info size={20} className="text-blue-600" /></span>
             <p className="text-[10px] text-blue-800 leading-relaxed">
               <span className="font-bold">Pro Tip:</span> Local ID and Serial Number should be unique to avoid master data conflicts during Daltex ERP synchronization.
             </p>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 sap-shadow overflow-hidden min-h-[400px]">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet size={16} className="text-emerald-600" />
                Staging Table - Data Preview
              </h3>
              {stagedData.length > 0 && (
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Records Loaded: {stagedData.length}
                </span>
              )}
            </div>

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="text-sm font-medium">Parsing and validating records...</p>
              </div>
            ) : stagedData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                  <FileText size={48} className="text-gray-200" />
                </div>
                <p className="text-sm font-medium italic">No file uploaded yet. Use the upload workflow on the left.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Valid</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Brand/Model</th>
                      <th className="px-4 py-3">Group</th>
                      <th className="px-4 py-3">Local ID</th>
                      <th className="px-4 py-3">Serial</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stagedData.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/80 transition-colors text-xs">
                        <td className="px-4 py-3">
                          {row.isValid ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <div className="relative group">
                              <AlertCircle size={16} className="text-red-500" />
                              <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white text-[9px] p-2 rounded w-32 opacity-0 group-hover:opacity-100 z-50 pointer-events-none">
                                Mandatory fields (Description/Brand) missing
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{row.itemDescription}</td>
                        <td className="px-4 py-3 text-gray-600">{row.modelBrand}</td>
                        <td className="px-4 py-3 text-gray-500">{row.mainGroup} / {row.subGroup}</td>
                        <td className="px-4 py-3 font-mono text-blue-600 font-bold">{row.localId}</td>
                        <td className="px-4 py-3 text-gray-500">{row.serialChassis}</td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-bold text-gray-600 px-1.5 py-0.5 bg-gray-100 rounded">
                            {row.serviceStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => removeRow(i)}
                            className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadView;
