// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	interface D1PreparedStatement {
		bind(...values: unknown[]): D1PreparedStatement;
		run(): Promise<unknown>;
	}

	interface D1Database {
		prepare(query: string): D1PreparedStatement;
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				NOMINATIONS_DB: D1Database;
			};
		}
	}
}

export {};
