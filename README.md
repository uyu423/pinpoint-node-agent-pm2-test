- [Overview](#overview)
  - [두괄식 결론](#두괄식-결론)
  - [Environments](#environments)
  - [Tests](#tests)
    - [npm run start:node](#npm-run-startnode)
      - [Request `/`](#request-)
      - [Request `/complex`](#request-complex)
    - [npm run start:pm2](#npm-run-startpm2)
    - [npm run start:ts](#npm-run-startts)

# Overview

- pm2 + axios 조합 사용시 특정 조건에서 outgoingRequest가 [pinpoint-node-agent](https://github.com/pinpoint-apm/pinpoint-node-agent) 에서 수집 되지 않는다. 이 케이스를 찾아보자

  ```bash
  npm install && cp .env_sample .env
  # if you need, edit .env
  ```

## 두괄식 결론

- 예상했던 결과랑은 좀 다른데... `pm2` 가 아니라 `axios` 조합에 문제가 있는건가 싶다.
  - 프로세스 실행 런타임 `pm2`, `node`, `ts-node` 별로 결과가 다를 줄 알았는데 아니었다.
- 공통적으로 첫번째 outgoingRequest 는 수집이 되는데 두번째부터 잘 안되는거 같다.
- 개인 프로젝트에서 Redis 지표도 수집이 안되었는데 `ioredis` 와의 조합에 문제가 있는걸까.

## Environments

- Node.js > 12 (@see `.nvmrc`, tested on 14.15.0 LTS)
- typescript@^4.0.5
- express@^4.17.1
- axios@^0.21.0

## Tests

### `npm run start:node`

- `node` 커맨드로 js 파일 실행

#### Request `/`

- 첫번째 요청은 성공하나 두번째 요청부터 수집안됨
- Try 1
  ```
  start traceOutgoingRequest
  >> Writer http header
  [Object: null prototype] {
    accept: 'application/json, text/plain, */*',
    'user-agent': 'axios/0.21.0',
    host: 'www.naver.com',
    'pinpoint-traceid': 'test_agent^1604291677381^0',
    'pinpoint-spanid': 7694488966104147,
    'pinpoint-pspanid': '5429579909826115',
    'pinpoint-pappname': 'cx-test-service-pm2',
    'pinpoint-papptype': 1400,
    'pinpoint-flags': 0,
    'pinpoint-host': 'www.naver.com'
  }
  intercepted http.ClientcRequest response event { id: 'www.naver.com/' }
  intercepted http.IncomingMessage end event { id: 'www.naver.com/' }
  ```
- Try 2
  ```
  start traceOutgoingRequest
  start traceOutgoingRequest
  start traceOutgoingRequest
  ```

#### Request `/complex`

- 위와 마찬가지

### `npm run start:pm2`

- `pm2-runtime` 명령어로 js 파일 실행
- `npm run start:node` 실행 결과와 동일

### `npm run start:ts`

- `ts-node` 명령어로 ts 파일 실행
- `npm run start:node` 실행 결과와 동일
