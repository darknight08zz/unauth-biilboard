import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Eye 
} from "lucide-react";

const Dashboard = () => {
  const monthlyData = [
    { month: "Jan", reports: 65 },
    { month: "Feb", reports: 78 },
    { month: "Mar", reports: 92 },
    { month: "Apr", reports: 101 },
    { month: "May", reports: 87 },
    { month: "Jun", reports: 95 },
  ];

  const violationData = [
    { name: "Size Violations", value: 35, color: "#059669" },
    { name: "Placement Issues", value: 28, color: "#10b981" },
    { name: "Safety Hazards", value: 22, color: "#34d399" },
    { name: "Missing Permits", value: 15, color: "#6ee7b7" },
  ];

  const recentReports = [
    {
      id: "BG2024001",
      location: "MG Road, Sector 14",
      type: "Size Violation",
      status: "Under Review",
      priority: "High",
      date: "2024-01-15",
    },
    {
      id: "BG2024002",
      location: "City Center Mall",
      type: "Safety Hazard",
      status: "Resolved",
      priority: "Critical",
      date: "2024-01-14",
    },
    {
      id: "BG2024003",
      location: "Highway Junction",
      type: "Missing Permit",
      status: "In Progress",
      priority: "Medium",
      date: "2024-01-13",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-green-500/20 text-green-400";
      case "In Progress": return "bg-blue-500/20 text-blue-400";
      case "Under Review": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-500/20 text-red-400";
      case "High": return "bg-orange-500/20 text-orange-400";
      case "Medium": return "bg-blue-500/20 text-blue-400";
      case "Low": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <section id="dashboard" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground text-lg">
            Real-time insights into billboard compliance and enforcement activities
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-card border-border shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Reports</p>
                <p className="text-2xl font-bold text-foreground">1,247</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+12% this month</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-accent rounded-lg">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Resolved Issues</p>
                <p className="text-2xl font-bold text-foreground">892</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+8% this month</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-accent rounded-lg">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-foreground">156</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Clock className="h-3 w-3 text-yellow-400" />
                  <span className="text-yellow-400 text-xs">2.3 days avg</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-accent rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Resolution Rate</p>
                <p className="text-2xl font-bold text-foreground">71.6%</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+5% this month</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-accent rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Monthly Reports Chart */}
          <Card className="bg-card border-border shadow-card p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Monthly Reports Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Bar dataKey="reports" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Violation Types Chart */}
          <Card className="bg-card border-border shadow-card p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Violation Categories</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={violationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {violationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {violationData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Reports Table */}
        <Card className="bg-card border-border shadow-card">
          <div className="p-6 border-b border-border">
            <h3 className="text-xl font-semibold text-foreground">Recent Reports</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-muted-foreground font-medium">Report ID</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Location</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Type</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Priority</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-primary text-sm">{report.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{report.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-foreground">{report.type}</span>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getPriorityColor(report.priority)}>
                        {report.priority}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-muted-foreground">{report.date}</span>
                    </td>
                    <td className="p-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          alert(`Viewing details for report ${report.id}\n\nLocation: ${report.location}\nType: ${report.type}\nStatus: ${report.status}\nPriority: ${report.priority}\nDate: ${report.date}`);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;
