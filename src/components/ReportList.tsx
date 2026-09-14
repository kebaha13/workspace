import { Report } from '../types';

interface ReportListProps {
  reports: Report[];
  onSelect: (report: Report) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterCategory: string;
  onFilterChange: (category: string) => void;
  filterStatus: string;
  onStatusFilterChange: (status: string) => void;
}

const statusColors: Record<string, string> = {
  brouillon: 'bg-yellow-100 text-yellow-800',
  final: 'bg-green-100 text-green-800',
  archivé: 'bg-gray-100 text-gray-600',
};

const statusIcons: Record<string, string> = {
  brouillon: '📝',
  final: '✅',
  archivé: '📦',
};

const categoryColors: Record<string, string> = {
  Travail: 'bg-blue-100 text-blue-700',
  Personnel: 'bg-purple-100 text-purple-700',
  Finances: 'bg-emerald-100 text-emerald-700',
  Projet: 'bg-orange-100 text-orange-700',
  Réunion: 'bg-pink-100 text-pink-700',
  Autre: 'bg-gray-100 text-gray-700',
};

export default function ReportList({
  reports,
  onSelect,
  onDelete,
  searchQuery,
  onSearchChange,
  filterCategory,
  onFilterChange,
  filterStatus,
  onStatusFilterChange,
}: ReportListProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un rapport..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-800 placeholder-gray-400"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-800 bg-white min-w-[150px]"
          >
            <option value="">Toutes catégories</option>
            <option value="Travail">Travail</option>
            <option value="Personnel">Personnel</option>
            <option value="Finances">Finances</option>
            <option value="Projet">Projet</option>
            <option value="Réunion">Réunion</option>
            <option value="Autre">Autre</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-800 bg-white min-w-[140px]"
          >
            <option value="">Tous statuts</option>
            <option value="brouillon">Brouillon</option>
            <option value="final">Final</option>
            <option value="archivé">Archivé</option>
          </select>
        </div>
      </div>

      {/* Compteur */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium">
          {reports.length} rapport{reports.length !== 1 ? 's' : ''} trouvé{reports.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Liste des rapports */}
      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-folder-open text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun rapport trouvé</h3>
          <p className="text-gray-400">
            {searchQuery || filterCategory || filterStatus
              ? 'Essayez de modifier vos filtres.'
              : 'Commencez par créer votre premier rapport !'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => onSelect(report)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[report.category] || categoryColors.Autre}`}>
                      {report.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[report.status]}`}>
                      {statusIcons[report.status]} {report.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {report.content.substring(0, 150)}
                    {report.content.length > 150 ? '...' : ''}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    <i className="far fa-calendar-alt mr-1"></i>
                    Créé le {formatDate(report.createdAt)}
                    {report.updatedAt !== report.createdAt && (
                      <span className="ml-3">
                        <i className="fas fa-pen mr-1"></i>
                        Modifié le {formatDate(report.updatedAt)}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
                      onDelete(report.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Supprimer"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
