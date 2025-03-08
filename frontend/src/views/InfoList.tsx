import { IInfo } from '../types/info';

interface InfoListProps {
  infos: IInfo[];
}

const InfoList = ({ infos }: InfoListProps) => {
  return (
    <div className="space-y-4">
      {infos.map((info) => (
        <div key={info._id} className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">{info.title}</h3>
          <p className="text-gray-600 mt-2">{info.content}</p>
          <small className="text-gray-400">
            {new Date(info.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default InfoList;