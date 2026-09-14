import { useState, useMemo } from 'react';
import { Report } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import ReportDetail from './components/ReportDetail';

type View = 'list' | 'create' | 'edit' | 'detail';

export default function App() {
  const [reports, setReports] = useLocalStorage<Report[]>('mes-rapports', []);
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => {
        const matchesSearch =
          !searchQuery ||
          report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !filterCategory || report.category === filterCategory;
        const matchesStatus = !filterStatus || report.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [reports, searchQuery, filterCategory, filterStatus]);

  const handleCreate = (data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newReport: Report = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setReports((prev) => [newReport, ...prev]);
    setCurrentView('list');
  };

  const handleUpdate = (data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id
          ? { ...r, ...data, updatedAt: new Date().toISOString() }
          : r
      )
    );
    setSelectedReport(null);
    setCurrentView('list');
  };

  const handleDelete = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    setSelectedReport(null);
    setCurrentView('list');
  };

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
    setCurrentView('detail');
  };

  const handleEditReport = () => {
    setCurrentView('edit');
  };

  const stats = useMemo(() => {
    return {
      total: reports.length,
      brouillons: reports.filter((r) => r.status === 'brouillon').length,
      finals: reports.filter((r) => r.status === 'final').length,
      archives: reports.filter((r) => r.status === 'archivé').length,
    };
  }, [reports]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              setCurrentView('list');
              setSelectedReport(null);
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <i className="fas fa-clipboard-list text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Mes Rapports</h1>
              <p className="text-xs text-gray-500">Gestionnaire de rapports personnels</p>
            </div>
          </div>
          {currentView === 'list' && (
            <button
              onClick={() => setCurrentView('create')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              <span className="hidden sm:inline">Nouveau rapport</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats - visible uniquement en vue liste */}
        {currentView === 'list' && reports.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-alt text-indigo-600"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📝</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.brouillons}</p>
                  <p className="text-xs text-gray-500">Brouillons</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">✅</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.finals}</p>
                  <p className="text-xs text-gray-500">Finals</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📦</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stats.archives}</p>
                  <p className="text-xs text-gray-500">Archivés</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Views */}
        {currentView === 'list' && (
          <ReportList
            reports={filteredReports}
            onSelect={handleSelectReport}
            onDelete={handleDelete}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            filterStatus={filterStatus}
            onStatusFilterChange={setFilterStatus}
          />
        )}

        {currentView === 'create' && (
          <ReportForm
            onSubmit={handleCreate}
            onCancel={() => setCurrentView('list')}
          />
        )}

        {currentView === 'edit' && selectedReport && (
          <ReportForm
            onSubmit={handleUpdate}
            onCancel={() => setCurrentView('detail')}
            initialData={selectedReport}
          />
        )}

        {currentView === 'detail' && selectedReport && (
          <ReportDetail
            report={selectedReport}
            onEdit={handleEditReport}
            onBack={() => setCurrentView('list')}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400">
        <p>Mes Rapports © {new Date().getFullYear()} — Vos données sont stockées localement</p>
      </footer>
    </div>
  );
}
