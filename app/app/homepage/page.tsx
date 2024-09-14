import Container from '@mui/material/Container';
import Navbar from '@/components/ui/Navbar/nav';
import styles from './page.module.css'

export default function Page() {
  return (
  <>
    <Navbar/>
    <Container className={styles.containerBase}>
        <p className={`text-3xl font-semibold`}>Welcome to Hack The North's PEVV!</p>
        <p>Try uploading or searching for a video to get started</p>
    </Container>
 
  </>
  );
}
