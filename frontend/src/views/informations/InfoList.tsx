import { IInfo } from '../../types/info';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';

interface InfoListProps {
  infos: IInfo[];
}

const InfoList = ({ infos }: InfoListProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {infos.map((info) => (
        <Link 
          to={`/informations/${info._id}`}
          key={info._id} 
          className="bg-white rounded-lg ring-1 ring-gray-900/5 shadow-sm p-6 hover:shadow-sm transition-shadow group"
        >
          <article>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {info.title}
              </h2>
              <span className="inline-block bg-secondary/80 text-black px-3 py-1 rounded-lg text-xs">
                {info.category.name}
              </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">
              {info.content}
            </p>

            <div className="flex justify-between items-center">
              <time className="text-sm text-gray-500">
                {new Date(info.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="text-primary flex items-center gap-1 text-sm font-medium">
                Lire plus
                <BsArrowRight className="w-4 h-4" />
              </span>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
};

export default InfoList;