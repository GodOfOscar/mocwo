import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Example report data (later you can fetch from API/DB)
const reportData: Record<string, { name: string; report: string }> = {
  opoku: {
    name: "Opoku Ware Senior High School",
    report: "In March 2024, MOCWO visited Opoku Ware SHS and mentored 1200+ students. Sessions included STEM career guidance, character development, and worship fellowship. Many students testified of renewed hope and vision for their future.",
  },
  prempeh: {
    name: "Prempeh Senior High School",
    report: "In February 2024, MOCWO reached 1850 students at Prempeh SHS. The program focused on leadership, integrity, and science innovation projects. A number of students committed to Christian values while pursuing excellence in academics.",
  },
  stlouis: {
    name: "St. Louis Senior High School",
    report: "In January 2024, over 1600 students participated in mentorship sessions at St. Louis SHS. Topics included discipline, academic focus, and spiritual growth. The team also donated Christian books to the school library.",
  },
  // Add more...
};

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const schoolReport = id ? reportData[id] : null;

  if (!schoolReport) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Report not found</h2>
        <Link to="/schools">
          <Button className="mt-4">⬅ Back to Schools</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center">
        {schoolReport.name} - Report
      </h1>
      <Card className="shadow-md">
        <CardContent className="p-6">
          <p className="text-lg leading-relaxed text-gray-700">
            {schoolReport.report}
          </p>
        </CardContent>
      </Card>
      <div className="text-center mt-6">
        <Link to="/schools">
          <Button variant="outline">⬅ Back to Schools</Button>
        </Link>
      </div>
    </div>
  );
}
