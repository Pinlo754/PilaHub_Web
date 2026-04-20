import { SystemConfigType } from "@/utils/SystemConfigType";
import SystemConfigRow from "./SystemConfigRow";

type Props = {
  configs: SystemConfigType[];
  onPressConfig: (config: SystemConfigType) => void;
};

const SystemConfigTable = ({ configs, onPressConfig }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-orange-100">
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Tên cấu hình
          </th>
          <th className="text-left py-3 px-4 font-semibold text-orange-700">
            Mô tả
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Giá trị
          </th>
          <th className="text-center py-3 px-4 font-semibold text-orange-700">
            Cập nhật lần cuối
          </th>
        </tr>
      </thead>
      <tbody>
        {configs.map((cfg) => (
          <SystemConfigRow
            key={cfg.configId}
            config={cfg}
            onPressConfig={onPressConfig}
          />
        ))}
      </tbody>
    </table>
  );
};

export default SystemConfigTable;
