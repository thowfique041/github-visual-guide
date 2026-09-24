import React, { useState, useMemo } from 'react';
import { COMMANDS_DATA, CATEGORIES_META } from '../../data/commandsData';
import { CommandItem, GitCategory } from '../../types/git';
import { CommandCard } from './CommandCard';
import { CommandDetailModal } from './CommandDetailModal';
import { 
  Search, 
  Filter, 
  Terminal, 
  Bookmark, 
  Sparkles, 
  BookOpen, 
  GitBranch, 
  Layers, 
  Cloud, 
  RotateCcw, 
  Users, 
  Zap 
} from 'lucide-react';

interface CommandCatalogProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const CommandCatalog: React.FC<CommandCatalogProps> = ({
  favorites,
  onToggleFavorite
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [activeModalCommand, setActiveModalCommand] = useState<CommandItem | null>(null);

  const filteredCommands = useMemo(() => {
    return COMMANDS_DATA.filter(cmd => {
      // Favorites filter
      if (onlyFavorites && !favorites.includes(cmd.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && cmd.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && cmd.difficulty !== selectedDifficulty) {
        return false;
      }

      // Search query (matches name, syntax, tags, description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = cmd.name.toLowerCase().includes(query);
        const matchesSyntax = cmd.syntax.toLowerCase().includes(query);
        const matchesDesc = cmd.shortDesc.toLowerCase().includes(query);
        const matchesTags = cmd.tags.some(t => t.toLowerCase().includes(query));
        return matchesName || matchesSyntax || matchesDesc || matchesTags;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, onlyFavorites, favorites]);

  const handleSelectRelated = (relatedName: string) => {
    const found = COMMANDS_DATA.find(c => c.name.toLowerCase().includes(relatedName.toLowerCase()));
    if (found) {
      setActiveModalCommand(found);
    } else {
      setSearchQuery(relatedName);
      setActiveModalCommand(null);
    }
  };

  const categories = [
    { id: 'all', label: 'All', icon: Terminal },
    { id: 'basic', label: 'Basic Git', icon: BookOpen },
    { id: 'branching', label: 'Branching', icon: GitBranch },
    { id: 'remote', label: 'Remote / GitHub', icon: Cloud },
    { id: 'undo', label: 'Undo / Recovery', icon: RotateCcw },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'advanced', label: 'Advanced', icon: Zap },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Git commands, e.g. 'undo commit', 'push', 'merge conflict', 'stash'..."
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#8b949e] outline-none focus:border-[#58a6ff] transition-colors font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8b949e] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Toggles */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] text-xs font-mono text-[#c9d1d9] px-3 py-2.5 rounded-xl outline-none cursor-pointer focus:border-[#58a6ff]"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-mono border transition-all ${
                onlyFavorites
                  ? 'bg-[#d29922]/20 text-[#d29922] border-[#d29922]/40'
                  : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Favorites</span> ({favorites.length})
            </button>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/40 shadow-sm'
                    : 'bg-[#0d1117] text-[#8b949e] border border-[#30363d] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Command Cards */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-[#8b949e] mb-4">
          <span>
            Showing{' '}
            <strong className="text-white">{filteredCommands.length}</strong>
            {' '}of{' '}
            <strong className="text-[#58a6ff]">{COMMANDS_DATA.length}</strong>
            {' '}commands
          </span>
          {searchQuery && (
            <span>Search: "<strong className="text-white">{searchQuery}</strong>"</span>
          )}
        </div>

        {filteredCommands.length === 0 ? (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-12 text-center space-y-3">
            <Terminal className="w-8 h-8 text-[#8b949e] mx-auto opacity-50" />
            <h3 className="text-base font-semibold text-white">No commands found</h3>
            <p className="text-xs text-[#8b949e] max-w-md mx-auto">
              No Git commands matched your filters or search query. Try clearing filters or searching for terms like "add", "commit", "push", or "branch".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedDifficulty('all'); setOnlyFavorites(false); }}
              className="px-4 py-2 rounded-xl bg-[#21262d] text-xs font-semibold text-white border border-[#30363d] hover:bg-[#30363d] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommands.map(cmd => (
              <CommandCard
                key={cmd.id}
                command={cmd}
                isFavorite={favorites.includes(cmd.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectCommand={(c) => setActiveModalCommand(c)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Breakdown Modal */}
      <CommandDetailModal
        command={activeModalCommand}
        onClose={() => setActiveModalCommand(null)}
        isFavorite={activeModalCommand ? favorites.includes(activeModalCommand.id) : false}
        onToggleFavorite={onToggleFavorite}
        onSelectRelated={handleSelectRelated}
      />
    </div>
  );
};
