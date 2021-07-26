import Link from 'next/link';
import React from 'react'
import styles from './header.module.scss'


export default function Header() {
  return(
    <>
      <header className={styles.container}>
        <Link href="/">
          <a href="">
            <img src="/Logo.svg" alt="logo" />
          </a>
        </Link>
      </header>
    </>
  )
}
