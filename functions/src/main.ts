import * as functions from 'firebase-functions';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const dotenv = require('dotenv');
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
dotenv.config();

const config: ServiceAccount = {
  projectId: 'smartstudentnotebook',
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCZUJzYYzTgVxMM\nAdQITsj+YMM1Rtu2NtRIXIC5L9nF3KwR6bcowehaAFYLQ7bDhbPCb19LSjLDf1eB\nn10q4Hk9892sHoOX5w8CkYQb3riTmwzYVYGQGrcbiljdAhbjlxhzH9V/g2BevXZk\n6mFEwJ6pOBEn2hnG9xXqt04cL4vRbCQZm21yYqVlt+26V60dERJCYKaLKCJ6ET5C\non4D4A/Vql3v63Ve6X9T1psLHoZs4V+YPvqqvt5OwDbRGPa2tnmwS5DBgh5VuJ+z\nTnG7YIkrNH0TiGrR6O/Epe1CnRZkcmTCvqP9aMX0RVGEBAgxwhg1ajGcDHnZl7Hg\n05F//hWfAgMBAAECgf8x7twsPQbwTk9R3hNeOun86csywhoiT4u3qpaGWTzYcwa0\nOu1KWPmvARevu1hqYSzKEARw3BSmyrCNknZIewEkBIHeZTmej1Lzd9IMR2FCS1+T\n+W0oLJxaDEM//C+lws7TCwKrf2hVfkMFzkqVyjHL2j4AbR8Ukb/m9ndG+w19mPWi\n26FC2s2QoDeCTIPSghJw31ivU1LPulvVQ/6fYoPIXqR2mXQ8sT2JnlTm55bWvIr7\nNyT1lIX6XCrffLPXCMBM9PaJ243zY/3F5bghNvkZn7KAEK/psX/0WJheqUtgUxwz\ntZhfbtDdhwKdBky2pxQW9TzwiQmqX47eyJCnZsECgYEAyHOGcbHqoOBSnQnfcdKq\nbFUBlzsIb/wYbOks/vHff9GqvncNRHg0USLSQUzdIVmD8+LqkVjJnFydcAJCwhvY\nuP+WR11+6KFVG21+pEhpeZ7fTP8qcBZJnI7wYufp8wqnXWRtdQ8a18WGM28VwKgG\nHGv/ApO/mbJ/x501LhOODt0CgYEAw80f1XM+x7xeetnfDKiOaOGZ+z91pEoG9v7p\nMrkGWYf4LUo00wprmFWLTV1kuyayj19IbSaFuGK7k0LMC9KIJp8urXbqxU27/A9u\n1jxg+st0lPPM0vQtRfZ0iPmjqEjQOMmm0iiOGgaqNjZkpy6oJzjLisaKN0e96kRY\nEi7cSKsCgYBXNOtoy16oXu+SIplzi5NZTiJDCQvCrIpz134b7F6v3SfLdT/wadtY\n8S1H+4i42ZjuoeorEdWkkSZtdI5WpIbE9W0L30E3M/ky1ZAjKN26a8P6W4i6+vdL\nhWRPo1XExv3JQ8fbBZdICEc6WTm9d1wxQUrQdDcHRwEQdvSL9zX2gQKBgCCLXqgu\n0JeIUrfesLk85va90Mc3BAm7mC7DreUVZd3JwNFeTStqxvl59n50cIK+6tzzvGkQ\nBxffqUfPyXSJmMG6oZqJcno68mzx771CKehlmsoLP9csaL4BOdtuiuo0uA9ITScP\nQJdI1k/OeKplEeP7B7HYUC7iCMoAdBcJnOmjAoGASfEsXKZm8EVW/I4m1T9H4mOl\nmTNWg+45ubxyvejKYp4wjvF/cQGFIcG9+mrt3RsjnXJXwYaqey9T5GZqzuqMH9tv\nCWk1xDyj67ad9/Lmr6U+x36gikD/srTgc4dU7ym0zq8rfsJKSUFufpghB7JiZuMb\no8T1oT6iw1x4mP3Dm+I=\n-----END PRIVATE KEY-----\n',
  clientEmail:
    'firebase-adminsdk-yr211@smartstudentnotebook.iam.gserviceaccount.com',
};

export async function createNestServer() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 5001);
  admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL:
      'https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app',
  });

  // console.log(config);
}

createNestServer()
  .then((v) => console.log('Nest Ready'))
  .catch((err) => console.error('Nest broken', err));
