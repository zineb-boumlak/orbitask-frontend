import { useState, useEffect } from 'react';
import api from './api/axiosInstance';

export default function EquipeTab({ workspaceId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await api.get(`/api/workspaces/${workspaceId}/members`);
        if (!data.success) throw new Error(data.error || 'Erreur inconnue');
        setMembers(data.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) fetchMembers();
  }, [workspaceId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {error}
      </div>
    );
  }

  const roleBadge = (role) => {
    const isAdmin = role === 'admin';
    return (
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
        isAdmin
          ? 'bg-indigo-100 text-indigo-700'
          : 'bg-gray-100 text-gray-600'
      }`}>
        {isAdmin ? 'Administrateur' : 'Membre'}
      </span>
    );
  };

  return (
    <div className="p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">
        Membres de l'équipe
        <span className="ml-2 text-sm font-normal text-gray-400">({members.length})</span>
      </h4>

      <div className="space-y-2">
        {members.map((member, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              {/* Avatar initiales */}
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm flex items-center justify-center uppercase">
                {(member.user?.name || member.user?.email || '?')[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {member.user?.name || 'Sans nom'}
                </p>
                <p className="text-xs text-gray-400">{member.user?.email}</p>
              </div>
            </div>
            {roleBadge(member.role)}
          </div>
        ))}

        {members.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-6">Aucun membre</p>
        )}
      </div>
    </div>
  );
}