# @oomfware/jsx

server-side JSX renderer with streaming support, Suspense, and context.

```sh
npm install @oomfware/jsx
```

configure your `tsconfig.json` to use this package as the JSX runtime:

```json
{
	"compilerOptions": {
		"jsx": "react-jsx",
		"jsxImportSource": "@oomfware/jsx"
	}
}
```

## usage

render JSX responses in your route handlers:

```tsx
import { createRouter, route } from '@oomfware/fetch-router';
import { render, Suspense, use } from '@oomfware/jsx';

const routes = route({
	home: '/',
	users: {
		index: '/users',
		show: '/users/:id',
	},
});

const router = createRouter();

router.map(routes, {
	home() {
		return render(<HomePage />);
	},
	users: {
		index() {
			return render(<UserList />);
		},
		show({ params }) {
			return render(<UserProfile userId={params.id} />);
		},
	},
});

function HomePage() {
	return (
		<html>
			<head>
				<title>my app</title>
			</head>
			<body>
				<h1>welcome</h1>
			</body>
		</html>
	);
}
```

### streaming with Suspense

the page shell streams immediately while async sections resolve in the background:

```tsx
import { render, Suspense, use } from '@oomfware/jsx';

interface User {
	name: string;
	posts: { title: string }[];
}

function UserPosts({ user }: { user: Promise<User> }) {
	const { posts } = use(user);
	return (
		<ul>
			{posts.map((post) => (
				<li>{post.title}</li>
			))}
		</ul>
	);
}

function UserPage({ user }: { user: Promise<User> }) {
	return (
		<html>
			<head>
				<title>user profile</title>
			</head>
			<body>
				<h1>posts</h1>
				<Suspense fallback={<div>loading posts...</div>}>
					<UserPosts user={user} />
				</Suspense>
			</body>
		</html>
	);
}

router.get('/users/:id', ({ params }) => {
	const user = fetch(`/api/users/${params.id}`).then((r) => r.json());
	return render(<UserPage user={user} />);
});
```

the promise is created in the handler and passed down - `use()` caches by promise identity, so the
same instance must be used across renders.

### error responses

render errors with custom status codes:

```tsx
router.get('/admin', ({ store }) => {
	const user = store.inject(userKey);
	if (!user) {
		return render(<LoginPage />, { status: 401 });
	}
	return render(<AdminDashboard user={user} />);
});
```

### context

share values across components without prop drilling:

```tsx
import { createContext, renderToString, use } from '@oomfware/jsx';

const ThemeContext = createContext('light');

function ThemedButton() {
	const theme = use(ThemeContext);
	return <button class={theme}>click me</button>;
}

const html = await renderToString(
	<ThemeContext.Provider value="dark">
		<ThemedButton />
	</ThemeContext.Provider>,
);
// <button class="dark">click me</button>
```

### head hoisting

`<title>`, `<meta>`, `<link>`, and `<style>` elements are automatically hoisted to `<head>`:

```tsx
function Page() {
	return (
		<div>
			<title>my page</title>
			<meta name="description" content="page description" />
			<h1>content</h1>
		</div>
	);
}
```
