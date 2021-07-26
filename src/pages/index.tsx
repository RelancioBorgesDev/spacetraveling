import { GetStaticProps } from 'next';
import Header from '../components/Header';
import { FiCalendar, FiUser } from 'react-icons/fi'
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import '../styles/common.module.scss';
import React from 'react';
import  Link  from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

 export default function Home() {
   return(
     <>
      <main className={styles.main}>
        <Header/>
          <div className={styles.container}>
            <Link href="#">
              <a>
                <h1 className={styles.titulo}>Titulo</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                <div className={styles.iconsContainer}>
                  <span>
                    <FiCalendar className={styles.icon}/>
                    15 Mar 2021
                  </span>
                  <span>
                    <FiUser className={styles.icon}/>
                    Joseph Oliveira
                  </span>
                </div>
              </a>
            </Link>

            <Link href="#">
              <a>
                <h1 className={styles.titulo}>Titulo</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                <div className={styles.iconsContainer}>
                  <span>
                    <FiCalendar className={styles.icon}/>
                    15 Mar 2021
                  </span>
                  <span>
                    <FiUser className={styles.icon}/>
                    Joseph Oliveira
                  </span>
                </div>
              </a>
            </Link>
            
          <div className={styles.loadMore}>
              <Link href="#">
                <a>Carregar mais posts</a>
              </Link>
          </div>
          </div>

      </main>
    </>
   )
}

/* export const getStaticProps = async () => {
 const prismic = getPrismicClient();
 const postsResponse = await prismic.query();


//   // TODO
// }; */
