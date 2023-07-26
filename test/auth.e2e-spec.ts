import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handle a signup request', () => {
    const email = "tan2@gmail.com"
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: "123" })
      .expect(201)
      .then((res) => {
        const { email, id } = res.body
        expect(id).toBeDefined()
        expect(email).toEqual(email)
      })
  });

  it('signup with a new user then get the currently logged in user', async () => {
    const email = "tan@gmail.com"
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: "123" })
      .expect(201)
    const cookie = res.get('Set-Cookie')
    const { body } = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200)
    expect(body.email).toEqual(email)
  })
});
