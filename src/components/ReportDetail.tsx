import { Report } from '../types';

interface ReportDetailProps {
  report: Report;
  onEdit: () => void;
  onBack: () => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
  brouillon: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  final: 'bg-green-100 text-green-800 border-green-200',
  archivé: 'bg-gray-100 text-gray-600 border-gray-200',
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

export default function ReportDetail({ report, onEdit, onBack, onDelete }: ReportDetailProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 md:p-8 text-white">
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white mb-4 flex items-center gap-2 transition-colors text-sm font-medium"
        >
          <i className="fas fa-arrow-left"></i>
          Retour à la liste
        </button>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[report.category] || categoryColors.Autre}`}>
            {report.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[report.status]}`}>
            {statusIcons[report.status]} {report.status}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">{report.title}</h1>
        <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
          <span>
            <i className="far fa-calendar-alt mr-1"></i>
            {formatDate(report.createdAt)}
          </span>
          {report.updatedAt !== report.createdAt && (
            <span>
              <i className="fas fa-pen mr-1"></i>
              Modifié le {formatDate(report.updatedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
            {report.content}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <i className="fas fa-edit"></i>
            Modifier
          </button>
          <button
            onClick={() => {
              if (confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
                onDelete(report.id);
              }
            }}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 px-5 rounded-xl transition-all border border-red-200"
          >
            <i className="fas fa-trash-alt"></i>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
