import { Link } from "react-router-dom";
import { partnershipLevels } from "@/data/PartnershipLevels";  // Adjust the import path

const PartnershipLevelList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {partnershipLevels.map((level) => {
        const Icon = level.icon;  // Get icon for the level
        return (
          <Link key={level.slug} to={`/give/${level.slug}`}>
            <div className="cursor-pointer border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
              <div
                className={`w-12 h-12 mb-4 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-1">{level.title}</h3>
              <p className="text-primary font-bold mb-2">{level.amount}</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                {level.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PartnershipLevelList;
