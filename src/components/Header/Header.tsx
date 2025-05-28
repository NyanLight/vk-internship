import styles from './Header.module.css'
import logo from '../../assets/VK Logo.svg'

export function Header() {

    return (
    <header className={styles.header}>
        <div className={styles.logoWrapper}><a href="https://vk.com/" target='_blank' ><img src={logo}/></a></div>
        <div className={styles.headingWrapper}><h1 className={styles.heading}>Таблица</h1></div>
    </header>
    )
}