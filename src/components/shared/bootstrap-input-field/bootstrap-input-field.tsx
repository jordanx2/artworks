import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import styles from './bootstrap-input-field.module.scss';
import classNames from 'classnames';
import { useField } from 'formik';
import { FaQuestionCircle } from 'react-icons/fa';
import { BootstrapInputFieldType } from './bootstrap-input-field.const';


interface BootstrapFormProps {
  placeholderText: string;
  required?: boolean;
  tooltipText?: string;
  name: string;
  classname?: string;
  value?: string;
  onChange?: () => void;
  dataTestId?: string;
  isDisabled?: boolean;
  type?: BootstrapInputFieldType;
}

const BootstrapInputField: React.FC<BootstrapFormProps> = ({ 
  placeholderText, 
  required = false, 
  tooltipText, 
  name, 
  classname,
  onChange,
  dataTestId,
  isDisabled = false,
  type = BootstrapInputFieldType.TEXT
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div className={classname}>
      <OverlayTrigger
        placement="top"
        overlay={
          meta.error ? (
        <Tooltip id={`tooltip-${name}`} className={styles.formikTooltip}>{meta.error}</Tooltip>
          ) : (
        <></>
          )
        }
      >
      <Form.Control
        type={type}
        data-testid={dataTestId}
        as={"input"}
        name={name}
        placeholder={placeholderText}
        className={classNames(styles.bootstrapInputField, {
          [styles.isInvalid]: meta.error 
        })}
        required={required}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          helpers.setValue(e.target.value);
          onChange?.();
        }}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        disabled={isDisabled}
      />
      </OverlayTrigger>

      {required && (
        <span className={styles.requiredAsterix}>*</span>        
      )}

      {tooltipText && (
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id={`icon-tooltip-${name}`}>{tooltipText}</Tooltip>}
        >
          <span className={styles.questionCircle}>
            <FaQuestionCircle />
          </span>
        </OverlayTrigger>
      )}
    </div>
  );
};

export default BootstrapInputField;
