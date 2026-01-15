import React, { useState } from 'react';
import { Upload, Undo2, Redo2, Download, AlertCircle, Info } from 'lucide-react';
import { useObjectDetection } from './hooks/useObjectDetection';
import { useCanvas } from './hooks/useCanvas';
import { useColorApplication } from './hooks/useColorApplication';
import { Button } from './components/common/Button';
import { Spinner } from './components/common/Spinner';
import { ErrorAlert } from './components/common/ErrorAlert';
import { DESIGN_COLORS, MESSAGES } from './constants';
import { useAppStore } from './store/useAppStore';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [showAmbiguityWarning, setShowAmbiguityWarning] = useState(false);

  const { data: detectionData, loading, error, processImage } = useObjectDetection();
  const { appliedColors, applyColor, undo, redo, canUndo, canRedo } = useColorApplication();

  const { canvasRef, imageRef } = useCanvas({
    image,
    objects: detectionData?.objects || [],
    selectedObjectId: selectedObject,
    hoveredObjectId: hoveredObject,
    appliedColors,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target?.result as string;
      setImage(imageData);
      await processImage(file);
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!detectionData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clicked = detectionData.objects.find((obj) => {
      const [x1, y1, x2, y2] = obj.bbox;
      return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    });

    if (clicked) {
      if (clicked.ambiguity) {
        setShowAmbiguityWarning(true);
        setHoveredObject(clicked.id);
        return;
      }
      setSelectedObject(clicked.id);
    } else {
      setSelectedObject(null);
    }
  };

  const handleColorSelect = (color: string) => {
    if (!selectedObject) return;
    applyColor(selectedObject, color);
  };

  const handleExport = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'design-preview.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                DIY Vision Designer
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                AI-assisted interior design preview
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                title="Undo"
              >
                <Undo2 size={18} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                title="Redo"
              >
                <Redo2 size={18} />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExport}
                disabled={!detectionData}
              >
                <Download size={16} className="mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              {!image ? (
                <label className="flex flex-col items-center justify-center h-[400px] sm:h-[600px] cursor-pointer hover:bg-slate-50 transition">
                  <Upload size={48} className="text-slate-400 mb-4" />
                  <p className="text-lg font-medium text-slate-700">
                    {MESSAGES.UPLOAD_PROMPT}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">PNG, JPG up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onMouseMove={(e) => {
                      if (!detectionData || !canvasRef.current) return;
                      const canvas = canvasRef.current;
                      const rect = canvas.getBoundingClientRect();
                      const scaleX = canvas.width / rect.width;
                      const scaleY = canvas.height / rect.height;
                      const x = (e.clientX - rect.left) * scaleX;
                      const y = (e.clientY - rect.top) * scaleY;

                      const hovered = detectionData.objects.find((obj) => {
                        const [x1, y1, x2, y2] = obj.bbox;
                        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
                      });
                      setHoveredObject(hovered?.id || null);
                    }}
                    onMouseLeave={() => setHoveredObject(null)}
                    className="w-full cursor-crosshair"
                  />
                  <img ref={imageRef} src={image} alt="" className="hidden" />

                  {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                      <div className="text-center">
                        <Spinner size="lg" className="mx-auto mb-4" />
                        <p className="text-slate-700 font-medium">
                          {MESSAGES.PROCESSING}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Scene Context */}
            {detectionData?.scene_context && (
              <div className="mt-4 bg-white rounded-lg shadow border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900">Scene Context</h3>
                    <div className="mt-2 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
                      <span className="whitespace-nowrap">
                        Environment: <strong>{detectionData.scene_context.environment}</strong>
                      </span>
                      <span className="whitespace-nowrap">
                        Room: <strong>{detectionData.scene_context.room_type}</strong>
                      </span>
                      <span className="whitespace-nowrap">
                        Lighting: <strong>{detectionData.scene_context.lighting}</strong>
                      </span>
                      <span className="whitespace-nowrap">
                        Confidence:{' '}
                        <strong>
                          {Math.round(detectionData.scene_context.confidence * 100)}%
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Warnings */}
            {detectionData?.warnings && detectionData.warnings.length > 0 && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-amber-900">Detection Notes</h4>
                    <ul className="mt-2 space-y-1">
                      {detectionData.warnings.map((warning, i) => (
                        <li key={i} className="text-xs sm:text-sm text-amber-800">
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Color Palette */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                Colors
              </h2>

              {!selectedObject ? (
                <p className="text-xs sm:text-sm text-slate-500">
                  {MESSAGES.SELECT_OBJECT}
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {DESIGN_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorSelect(color.value)}
                        className="aspect-square rounded-lg border-2 border-slate-200 hover:border-slate-400 transition"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Selected:{' '}
                    {detectionData?.objects.find((o) => o.id === selectedObject)?.label}
                  </p>
                </div>
              )}
            </div>

            {/* Detected Objects */}
            {detectionData?.objects && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                  Detected Objects
                </h2>
                <div className="space-y-2">
                  {detectionData.objects.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => !obj.ambiguity && setSelectedObject(obj.id)}
                      className={`w-full text-left p-3 rounded-lg border transition ${
                        selectedObject === obj.id
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      } ${obj.ambiguity ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 text-sm">
                          {obj.label}
                        </span>
                        {obj.ambiguity && (
                          <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Confidence: {Math.round(obj.confidence * 100)}%
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Ambiguity Warning Modal */}
      {showAmbiguityWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle size={24} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-900">
                  Uncertain Detection
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  {MESSAGES.AMBIGUITY_WARNING}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAmbiguityWarning(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowAmbiguityWarning(false);
                  if (hoveredObject) setSelectedObject(hoveredObject);
                }}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Proceed Anyway
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => {}} />}
    </div>
  );
}

export default App;