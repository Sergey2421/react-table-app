import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  TextField, 
  Button, 
  Box, 
  Grid as MuiGrid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Collapse
} from '@mui/material';
import { userSchema } from '../schemas/userSchema';
import type { NewUser } from '../types/User';

interface UserFormProps {
  onSubmit: (data: NewUser) => Promise<void>;
  isSubmitting: boolean;
}

interface FieldConfig {
  name: keyof NewUser;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select';
  options?: { value: string; label: string; }[];
  gridProps?: {
    xs?: number;
    sm?: number;
  };
}

const FORM_FIELDS: FieldConfig[] = [
  { name: 'firstName', label: 'First Name', type: 'text' },
  { name: 'lastName', label: 'Last Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'position', label: 'Position', type: 'text' },
  { name: 'department', label: 'Department', type: 'text' },
  { name: 'salary', label: 'Salary', type: 'number' },
  { name: 'hireDate', label: 'Hire Date', type: 'date' },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select',
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
      { value: 'On Leave', label: 'On Leave' }
    ],
    gridProps: { xs: 12, sm: 12 }
  }
];

const FormField: React.FC<{
  field: FieldConfig;
  register: any;
  errors: any;
  disabled: boolean;
}> = ({ field, register, errors, disabled }) => {
  const { name, label, type, options } = field;
  
  if (type === 'select' && options) {
    const labelId = `${name}-label`;
    return (
      <FormControl fullWidth error={!!errors[name]}>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          {...register(name)}
          labelId={labelId}
          id={name}
          label={label}
          disabled={disabled}
          defaultValue=""
        >
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      {...register(name, type === 'number' ? { valueAsNumber: true } : undefined)}
      fullWidth
      label={label}
      type={type}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      disabled={disabled}
    />
  );
};

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, isSubmitting }) => {
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewUser>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: 0,
      hireDate: '',
      status: '',
    },
    mode: 'onChange',
  });

  const onSubmitHandler = async (data: NewUser) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);
      await onSubmit(data);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to add user');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ mt: 3 }}>
      <Collapse in={!!submitError}>
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      </Collapse>
      
      <Collapse in={submitSuccess}>
        <Alert severity="success" sx={{ mb: 2 }}>
          User successfully added!
        </Alert>
      </Collapse>

      <MuiGrid container spacing={2}>
        {FORM_FIELDS.map((field) => (
          <MuiGrid 
            key={field.name} 
            item 
            xs={field.gridProps?.xs ?? 12} 
            sm={field.gridProps?.sm ?? 6}
          >
            <FormField
              field={field}
              register={register}
              errors={errors}
              disabled={isSubmitting}
            />
          </MuiGrid>
        ))}
      </MuiGrid>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
      >
        {isSubmitting ? 'Adding User...' : 'Add User'}
      </Button>
    </Box>
  );
}; 