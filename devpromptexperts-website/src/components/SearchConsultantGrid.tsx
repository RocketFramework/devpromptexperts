// components/consultants/ConsultantGrid.tsx
import { ConsultantDTO as Consultant } from '@/types/dtos/Consultant.dto';
import SearchConsultantCard from './SearchConsultantCard';

interface SearchConsultantGridProps {
  consultants: Consultant[];
}

export default function SearchConsultantGrid({ consultants }: SearchConsultantGridProps) {
  if (consultants.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No experts found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {consultants.map(consultant => (
        <SearchConsultantCard key={consultant.id} consultant={consultant} />
      ))}
    </div>
  );
}