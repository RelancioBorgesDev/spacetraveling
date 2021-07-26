import { GetStaticProps } from 'next';
import Header from '../components/Header';
import { FiCalendar, FiUser } from 'react-icons/fi'
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import '../styles/common.module.scss';
import React, { useState } from 'react';
import  Link  from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

 export default function Home({postsPagination}: HomeProps) {

  const formattedPost = postsPagination.results.map(post => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    };
  });

  const [posts, setPosts] = useState<Post[]>(formattedPost);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [currentPage, setCurrentPage] = useState(1);

  async function handleNextPage(): Promise<void> {
    if (currentPage !== 1 && nextPage === null) {
      return;
    }

    const postsResults = await fetch(`${nextPage}`).then(response =>
      response.json()
    );
    setNextPage(postsResults.next_page);
    setCurrentPage(postsResults.page);

    const newPosts = postsResults.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...posts, ...newPosts]);
  }

   return(
     <>
      <main className={styles.main}>
        <Header/>
          <div className={styles.container}>
            {posts.map(post =>(
              <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <h1 className={styles.titulo}>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div className={styles.iconsContainer}>
                  <span>
                    <FiCalendar className={styles.icon}/>
                    {post.first_publication_date}
                  </span>
                  <span>
                    <FiUser className={styles.icon}/>
                    {post.data.author}
                  </span>
                </div>
              </a>
            </Link>
            ))}

            {nextPage && (
            <button type="button" onClick={handleNextPage}>
              Carregar mais posts
            </button>
          )}

        </div>
      </main>
    </>
   )
}

export const getStaticProps: GetStaticProps = async () => {
 const prismic = getPrismicClient();
 const postsResponse = await prismic.query(
   [Prismic.Predicates.at('document.type', 'post')],
   {
     pageSize: 1,
   });

   const posts = postsResponse.results.map(post =>{
     return{
       uid: post.uid,
       first_publication_date: post.first_publication_date,
       data:{
         title: post.data.title,
         subtitle: post.data.subtitle,
         author: post.data.author,
       }
     }
   })
   const postsPagination = {
     next_page: postsResponse.next_page,
     results: posts
   }

  return{
    props: {
      postsPagination,
    }
  }

};


