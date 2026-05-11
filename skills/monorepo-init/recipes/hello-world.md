# Hello World Scaffolds

Per-stack minimal Hello World + unit test + e2e setup.

**Usage:** Step 9 reads the section matching `TECH_STACK[platform]`. Write files verbatim, replacing `<PROJECT_NAME>` and `<platform>` as needed.

**Coverage target:** ≥ 80% lines/statements. The minimal Hello World + its test achieves this by design (single function, fully tested).

---

## Next.js 15 (App Router)

### Source
```tsx
// app/page.tsx
export default function Home() {
  return (
    <main>
      <h1>Hello World</h1>
    </main>
  )
}
```

### Unit Test
```tsx
// app/page.test.tsx
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home', () => {
  it('renders hello world heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: /hello world/i })).toBeInTheDocument()
  })
})
```

### E2E (Playwright)
```ts
// e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test('homepage shows hello world', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /hello world/i })).toBeVisible()
})
```

### Config Files
```json
// package.json (extend existing or create)
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "vitest": "^2",
    "@vitejs/plugin-react": "^4",
    "@testing-library/react": "^16",
    "@testing-library/jest-dom": "^6",
    "@playwright/test": "^1"
  }
}
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: { provider: 'v8', thresholds: { lines: 80 } },
  },
})
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom'
```

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  webServer: { command: 'pnpm dev', url: 'http://localhost:3000', reuseExistingServer: true },
  use: { baseURL: 'http://localhost:3000' },
})
```

---

## Nuxt 3

### Source
```vue
<!-- pages/index.vue -->
<template>
  <main>
    <h1>Hello World</h1>
  </main>
</template>
```

### Unit Test (Vitest + @nuxt/test-utils)
```ts
// tests/index.nuxt.test.ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'
import { expect, it } from 'vitest'

it('renders hello world', async () => {
  const wrapper = await mountSuspended(IndexPage)
  expect(wrapper.text()).toContain('Hello World')
})
```

### E2E (Playwright)
```ts
// e2e/index.spec.ts
import { test, expect } from '@playwright/test'

test('homepage shows hello world', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /hello world/i })).toBeVisible()
})
```

### Config
```ts
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    coverage: { provider: 'v8', thresholds: { lines: 80 } },
  },
})
```

---

## Express + TypeScript

### Source
```ts
// src/app.ts
import express from 'express'

const app = express()
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ message: 'Hello World' })
})

export default app
```

```ts
// src/index.ts
import app from './app'

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => console.log(`Listening on :${PORT}`))
```

### Unit Test (Jest + Supertest)
```ts
// src/app.test.ts
import request from 'supertest'
import app from './app'

describe('GET /', () => {
  it('returns 200 with hello world message', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ message: 'Hello World' })
  })
})
```

### E2E (Playwright API)
```ts
// e2e/root.spec.ts
import { test, expect } from '@playwright/test'

test('GET / returns hello world', async ({ request }) => {
  const res = await request.get('http://localhost:3001/')
  expect(res.ok()).toBeTruthy()
  const body = await res.json()
  expect(body.message).toBe('Hello World')
})
```

### Config
```json
// package.json scripts
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "jest --coverage",
    "test:e2e": "playwright test"
  }
}
```

```js
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: { global: { lines: 80 } },
}
```

---

## NestJS

### Source
```ts
// src/app.controller.ts
import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getHello(): { message: string } {
    return { message: 'Hello World' }
  }
}
```

### Unit Test
```ts
// src/app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'

describe('AppController', () => {
  let controller: AppController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile()
    controller = module.get<AppController>(AppController)
  })

  it('returns hello world', () => {
    expect(controller.getHello()).toEqual({ message: 'Hello World' })
  })
})
```

### E2E (Supertest via NestJS e2e)
```ts
// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('App (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = module.createNestApplication()
    await app.init()
  })

  afterAll(() => app.close())

  it('GET / → { message: "Hello World" }', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ message: 'Hello World' })
  })
})
```

### Config
```json
// package.json scripts (merge with NestJS defaults)
{
  "scripts": {
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

---

## FastAPI

### Source
```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Hello World"}
```

### Unit Test (pytest + TestClient)
```python
# tests/test_root.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_returns_hello_world():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}
```

### E2E (pytest + httpx against running server)
```python
# tests/e2e/test_root_e2e.py
import httpx
import pytest

BASE_URL = "http://localhost:8000"

@pytest.mark.e2e
def test_root_e2e():
    with httpx.Client(base_url=BASE_URL) as client:
        r = client.get("/")
    assert r.status_code == 200
    assert r.json()["message"] == "Hello World"
```

### Config
```toml
# pyproject.toml (add to existing or create)
[tool.pytest.ini_options]
markers = ["e2e: end-to-end tests requiring a running server"]

[tool.coverage.run]
source = ["."]

[tool.coverage.report]
fail_under = 80
```

```
# requirements.txt
fastapi
uvicorn[standard]
pytest
pytest-cov
httpx
```

---

## Go + Gin

### Source
```go
// main.go
package main

import "github.com/gin-gonic/gin"

func main() {
	r := SetupRouter()
	r.Run()
}

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello World"})
	})
	return r
}
```

### Unit Test (go test + httptest)
```go
// main_test.go
package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRootReturnsHelloWorld(t *testing.T) {
	r := SetupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	var body map[string]string
	json.Unmarshal(w.Body.Bytes(), &body)
	assert.Equal(t, "Hello World", body["message"])
}
```

### E2E (go test with running server)
```go
// e2e/root_e2e_test.go
package e2e

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestRootE2E(t *testing.T) {
	res, err := http.Get("http://localhost:8080/")
	require.NoError(t, err)
	defer res.Body.Close()

	assert.Equal(t, 200, res.StatusCode)

	var body map[string]string
	json.NewDecoder(res.Body).Decode(&body)
	assert.Equal(t, "Hello World", body["message"])
}
```

### Commands
```bash
# Unit + coverage
go test ./... -coverprofile=coverage.out
go tool cover -func=coverage.out   # verify ≥ 80%

# E2E (server must be running in background)
go run main.go &
go test ./e2e/...
kill %1
```

---

## Strapi v5

Strapi manages its own admin panel. Hello World = health endpoint passes + first content-type exists.

### Unit Test (Jest + Strapi test utils)
```ts
// tests/health.test.ts
const Strapi = require('@strapi/strapi')

describe('Strapi health', () => {
  let strapi: any

  beforeAll(async () => {
    strapi = await Strapi().load()
  })

  afterAll(async () => {
    await strapi.destroy()
  })

  it('/_health returns 204', async () => {
    const res = await strapi.requestContext.get('/_health')
    expect(res.status).toBe(204)
  })
})
```

### E2E (Playwright — admin panel smoke test)
```ts
// e2e/admin.spec.ts
import { test, expect } from '@playwright/test'

test('admin panel loads', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveTitle(/Strapi/)
})
```

### Config
```json
// package.json scripts (add to Strapi defaults)
{
  "scripts": {
    "test": "jest --coverage",
    "test:e2e": "playwright test"
  }
}
```

---

## Flutter

### Source
```dart
// lib/main.dart
import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text('Hello World', key: const Key('helloText')),
        ),
      ),
    );
  }
}
```

### Unit Test (flutter_test)
```dart
// test/widget_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:<project_name>/main.dart';

void main() {
  testWidgets('renders Hello World text', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    expect(find.text('Hello World'), findsOneWidget);
    expect(find.byKey(const Key('helloText')), findsOneWidget);
  });
}
```

### E2E (integration_test)
```dart
// integration_test/app_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:<project_name>/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('hello world visible on launch', (tester) async {
    app.main();
    await tester.pumpAndSettle();
    expect(find.text('Hello World'), findsOneWidget);
  });
}
```

### Commands
```bash
# Unit + coverage
flutter test --coverage
# coverage/lcov.info generated — check lib/ coverage

# E2E (connected device/emulator required)
flutter test integration_test/
```

### pubspec.yaml additions
```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
```

---

## React Native / Expo

### Source
```tsx
// App.tsx
import { Text, View } from 'react-native'

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text testID="helloText">Hello World</Text>
    </View>
  )
}
```

### Unit Test (Jest + React Native Testing Library)
```tsx
// __tests__/App.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react-native'
import App from '../App'

describe('App', () => {
  it('renders hello world', () => {
    render(<App />)
    expect(screen.getByTestId('helloText')).toHaveTextContent('Hello World')
  })
})
```

### E2E (Detox)
```ts
// e2e/hello.test.ts
describe('Hello World', () => {
  beforeAll(async () => {
    await device.launchApp()
  })

  it('shows hello world on launch', async () => {
    await expect(element(by.id('helloText'))).toBeVisible()
    await expect(element(by.id('helloText'))).toHaveText('Hello World')
  })
})
```

### Config
```json
// package.json scripts
{
  "scripts": {
    "test": "jest --coverage",
    "test:e2e:build": "detox build --configuration ios.sim.debug",
    "test:e2e": "detox test --configuration ios.sim.debug"
  }
}
```

```js
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  coverageThreshold: { global: { lines: 80 } },
}
```
