import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import styles from './BackButton.module.css';

export default function BackButton({ onClick }) {
    return (
        <button onClick={onClick} className={styles.button}>
            <FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon>
        </button>
    );
}