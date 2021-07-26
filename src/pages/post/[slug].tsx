import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

 export default function Post({post}: PostProps) {
    return(
      <div>
        <div className={styles.header}>
          <Header/>
        </div>
        <img src="/test.png" alt="imagem" className={styles.banner} />
        <main className={commonStyles.container}>
            <div className={styles.post}>
              <div className={styles.postTop}>
                  <h1>Titulo</h1>
                  <ul>
                    <li>
                      <FiCalendar/>
                      26 JUL 21
                    </li>
                    <li>
                      <FiUser/>
                      Relancio Borges
                    </li>
                    <li>
                    <FiClock/>
                    5 min
                    </li>
                  </ul>
              </div>

              <article>
                <h2>Titulo section</h2>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo porro deserunt aperiam cum, atque sit assumenda, similique architecto commodi temporibus laborum at nemo sequi sed dignissimos eligendi debitis cupiditate nostrum.</p>
              </article>
            </div>
        </main>
      </div>
    )
 }

 export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID('posts', String(slug), {
    ref: previewData?.ref || null,
  });

  const prevPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]',
    }
  );

  const nextPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.last_publication_date desc]',
    }
  );

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };

  return {
    props: {
      post,
      navigation: {
        prevPost: prevPost?.results,
        nextPost: nextPost?.results,
      },
      preview,
    },
    revalidate: 1800,
  };
};

//1:07:27
