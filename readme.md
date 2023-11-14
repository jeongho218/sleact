## NestJS + TypeORM Slack 클론코딩

```
강의
https://www.inflearn.com/course/%EC%8A%AC%EB%9E%99%ED%81%B4%EB%A1%A0%EC%BD%94%EB%94%A9-%EB%B0%B1%EC%97%94%EB%93%9C/dashboard
강의 내용 Github
https://github.com/ZeroCho/sleact
```

## Installation

### FrontEnd

```bash

$ cd front
$ npm install
```

### BackEnd

```
$ cd a-nest
$ npm install
```

## Config .env

### FrontEnd

.env 없음

### BackEnd

/a-nest/.env

```
PORT=3095
DB_HOST=/* aws rds의 주소 */
DB_USERNAME=/* aws rds admin 이름 */
DB_PASSWORD=/* aws rds admin 패스워드 */
DB_DATABASE=/* 사용할 데이터베이스 이름 */
COOKIE_SECRET=cookienyamnyam
```

## Running the app

### FrontEnd

```bash
$ cd front
$ npm run dev
```

### BackEnd

```
$ cd a-nest

# watch mode
$ npm run start:dev
```

## Browser

```
localhost:3090
```
