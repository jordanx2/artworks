import BootstrapInputField from '../shared/bootstrap-input-field/bootstrap-input-field';
import { Formik, FormikProps } from 'formik';
import { useRef } from 'react';
import FlexColumn from '../shared/flex-column/flex-column';
import styles from './login-form.module.scss';
import * as Yup from 'yup';
import { LoginDetailsDomain, LoginFormFormik } from './login-form.const';
import { loginOrCreateUser } from '../../api/login-api/login-api';
import { toast } from 'react-toastify';
import { BootstrapInputFieldType } from '../shared/bootstrap-input-field/bootstrap-input-field.const';

const ValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .required('Username is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(30, 'Password must be at most 30 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
    .required('Password is required'),
});

interface LoginFormProps {
  onLoginSuccess: (user: LoginDetailsDomain) => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const formikRef = useRef<FormikProps<LoginFormFormik>>(null);

  const onSubmit = async (values: LoginFormFormik) => {
    const result = await loginOrCreateUser(values);

    if(result.user) {
      toast.success(result.message);
      onLoginSuccess(result.user);
    } else {
      toast.info(result.message);
    }
  };

  return (
    <Formik 
      innerRef={formikRef}
      initialValues={{
        username: '',
        password: ''
      }} 
      onSubmit={onSubmit}
      validationSchema={ValidationSchema}
    >
      <FlexColumn className={styles.loginCard} align='center'>
        <h2 className={styles.loginTitle}>Login to Your Account</h2>

        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <BootstrapInputField name="username" placeholderText="Enter username" />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <BootstrapInputField 
            name="password" 
            placeholderText="Enter password" 
            type={BootstrapInputFieldType.PASSWORD}
          />
        </div>

        <button onClick={() => formikRef.current?.submitForm()} className={styles.loginButton}>Login / Signup</button>
      </FlexColumn>
    </Formik>
  );
};

export default LoginForm;
