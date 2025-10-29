import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Users, BookOpen, Plus, Trash2, UserPlus } from 'lucide-react';
import { 
  getDepartments, 
  createDepartment, 
  deleteDepartment, 
  getDepartmentStats,
  Department 
} from '@/lib/departmentManager';
import { getAllUsers, UserProfile } from '@/lib/userManager';
import { getCourses, Course } from '@/lib/courseManager';

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  const [showDeptDialog, setShowDeptDialog] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    if (!user || user.role !== 'super_admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [depts, usersData, coursesData] = await Promise.all([
        getDepartments(),
        getAllUsers(),
        getCourses()
      ]);
      
      setDepartments(depts);
      setUsers(usersData);
      setCourses(coursesData);

      const statsData: Record<string, any> = {};
      for (const dept of depts) {
        statsData[dept.id] = await getDepartmentStats(dept.id);
      }
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!newDept.name || !newDept.code) {
      toast({
        title: 'Error',
        description: 'Name and code are required',
        variant: 'destructive'
      });
      return;
    }

    const result = await createDepartment(newDept.name, newDept.code, newDept.description);
    if (result) {
      toast({ title: 'Department created successfully!' });
      setShowDeptDialog(false);
      setNewDept({ name: '', code: '', description: '' });
      loadData();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create department',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('Are you sure? This will affect all users and courses in this department.')) return;
    
    const success = await deleteDepartment(id);
    if (success) {
      toast({ title: 'Department deleted' });
      loadData();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete department',
        variant: 'destructive'
      });
    }
  };

  if (!user || user.role !== 'super_admin') return null;

  const totalStats = {
    departments: departments.length,
    students: users.filter(u => u.role === 'student').length,
    instructors: users.filter(u => u.role === 'instructor').length,
    courses: courses.length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the entire college system</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.departments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.students}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.instructors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.courses}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="admins">Department Admins</TabsTrigger>
          <TabsTrigger value="courses">All Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Departments</CardTitle>
                  <CardDescription>Manage academic departments</CardDescription>
                </div>
                <Dialog open={showDeptDialog} onOpenChange={setShowDeptDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Department</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>Department Name</Label>
                        <Input
                          value={newDept.name}
                          onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                          placeholder="Computer Science"
                        />
                      </div>
                      <div>
                        <Label>Department Code</Label>
                        <Input
                          value={newDept.code}
                          onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                          placeholder="CS"
                        />
                      </div>
                      <div>
                        <Label>Description (Optional)</Label>
                        <Input
                          value={newDept.description}
                          onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                          placeholder="Department description"
                        />
                      </div>
                      <Button onClick={handleCreateDepartment} className="w-full">
                        Create Department
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading departments...</div>
              ) : departments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No departments yet. Create one to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {departments.map((dept) => (
                    <Card key={dept.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{dept.name}</h3>
                          <p className="text-sm text-muted-foreground">Code: {dept.code}</p>
                          {dept.description && (
                            <p className="text-sm text-muted-foreground mt-1">{dept.description}</p>
                          )}
                          <div className="flex gap-4 mt-3 text-sm">
                            <span>Students: {stats[dept.id]?.students || 0}</span>
                            <span>Instructors: {stats[dept.id]?.instructors || 0}</span>
                            <span>Courses: {stats[dept.id]?.courses || 0}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteDepartment(dept.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Department Admins</CardTitle>
                  <CardDescription>Department heads and administrators</CardDescription>
                </div>
                <Button disabled>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Admin (Coming Soon)
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users
                    .filter(u => u.role === 'department_admin')
                    .map(admin => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.department?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                            {admin.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {users.filter(u => u.role === 'department_admin').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No department admins yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>All Courses</CardTitle>
              <CardDescription>All courses across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>
                        {departments.find(d => d.id === course.departmentId)?.name || 'N/A'}
                      </TableCell>
                      <TableCell>{course.instructorName}</TableCell>
                      <TableCell>
                        <span className="capitalize px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {course.level}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {courses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No courses yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
