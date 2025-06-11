"use client";
import React, { useState } from 'react';
import { Calendar, Users, Building, Clock, DollarSign, FileText, CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { createProject } from '@/actions/project-action';
import { fromTheme } from 'tailwind-merge';

// Type definitions
interface Department {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface ProjectStatus {
  value: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  label: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  billable: boolean;
  departmentId: string;
  createdById: string;
  contributors: string[];
}

interface FormErrors {
  name?: string;
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  createdById?: string;
}

interface ProjectFormProps {
  departments: Department[];
  users: User[];
  currentUserId?: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  departments, 
  users, 
  currentUserId 
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'NOT_STARTED',
    billable: true,
    departmentId: '',
    createdById: currentUserId || '',
    contributors: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const projectStatuses: ProjectStatus[] = [
    { value: 'NOT_STARTED', label: 'Not Started' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'ON_HOLD', label: 'On Hold' }
  ];

  const handleInputChange = <K extends keyof ProjectFormData>(
    name: K,
    value: ProjectFormData[K]
  ): void => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleContributorToggle = (userId: string, checked: boolean): void => {
    setFormData(prev => ({
      ...prev,
      contributors: checked
        ? [...prev.contributors, userId]
        : prev.contributors.filter(id => id !== userId)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }

    if (!formData.createdById) {
      newErrors.createdById = 'Project creator is required';
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => formDataObj.append(key, item));
        } else {
          formDataObj.append(key, String(value));
        }
      });
      
      const res = await createProject(formDataObj);
      if(res.success){
        toast.success(res.message);
        console.log('Project Data:', res.project);
        handleReset();
      }
      // Here you would typically send the data to your API
    //   toast.success('Project created successfully! Check console for data.');
      
      // Reset form after successful submission
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (): void => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'NOT_STARTED',
      billable: true,
      departmentId: '',
      createdById: currentUserId || '',
      contributors: []
    });
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new project for your organization.
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Enter the fundamental details about your project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('name', e.target.value)
                }
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Project Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: ProjectFormData['status']) => 
                  handleInputChange('status', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {projectStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter project description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                handleInputChange('description', e.target.value)
              }
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline
          </CardTitle>
          <CardDescription>
            Set the project start and end dates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('startDate', e.target.value)
                }
                className={errors.startDate ? 'border-destructive' : ''}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('endDate', e.target.value)
                }
                className={errors.endDate ? 'border-destructive' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization
          </CardTitle>
          <CardDescription>
            Assign the project to a department and creator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select 
                value={formData.departmentId} 
                onValueChange={(value: string) => 
                  handleInputChange('departmentId', value)
                }
              >
                <SelectTrigger className={errors.departmentId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departmentId && (
                <p className="text-sm text-destructive">{errors.departmentId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="creator">Project Creator *</Label>
              <Select 
                value={formData.createdById} 
                onValueChange={(value: string) => 
                  handleInputChange('createdById', value)
                }
              >
                <SelectTrigger className={errors.createdById ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select creator" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.createdById && (
                <p className="text-sm text-destructive">{errors.createdById}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Project Settings
          </CardTitle>
          <CardDescription>
            Configure billing and other project settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="billable"
              checked={formData.billable}
              onCheckedChange={(checked: boolean) => 
                handleInputChange('billable', checked)
              }
            />
            <Label htmlFor="billable">This is a billable project</Label>
          </div>
        </CardContent>
      </Card>

      {/* Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Project Contributors
          </CardTitle>
          <CardDescription>
            Select team members who will contribute to this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map(user => (
              <div key={user.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`contributor-${user.id}`}
                  checked={formData.contributors.includes(user.id)}
                  onCheckedChange={(checked: boolean) => 
                    handleContributorToggle(user.id, checked)
                  }
                />
                <Label htmlFor={`contributor-${user.id}`} className="text-sm font-normal">
                  {user.name}
                  <span className="text-muted-foreground ml-1">({user.email})</span>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button variant="outline" onClick={handleReset} disabled={isSubmitting}>
          Reset
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </Button>
      </div>

      {/* Success/Error Messages */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            Please fix the errors above before submitting the form.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ProjectForm;