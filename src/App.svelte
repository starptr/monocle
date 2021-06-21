<script lang="ts">
	import type pg from "pg";
	type Input = string | number | string[];
	let clientUrl: Input = "http://localhost:8080";
	let query: Input = "SELECT * FROM customer;";
	let queryResult: Promise<pg.QueryResult>;
	let connectRes: Promise<string>;

	interface DbConfig extends Record<string, string> {
		username: string;
		host: string;
		port: string;
		db: string;
		password: string;
	}

	let dbConfig: DbConfig = {
		username: "postgres",
		host: "localhost",
		port: "5432",
		db: "dvdrental",
		password: "",
	};

	async function connectToDb(dbConfig: DbConfig): Promise<string> {
		let connect_url = new URL("connect", clientUrl as string);
		connect_url.search = new URLSearchParams(dbConfig).toString();
		const res = await fetch(connect_url.toString());
		if (res.ok) {
			return res.text();
		} else {
			throw new Error(await res.text());
		}
	}

	async function getQueryResult(query: Input): Promise<pg.QueryResult> {
		let query_url = new URL("query", clientUrl as string);
		let params = {
			query: query as string,
		};
		query_url.search = new URLSearchParams(params).toString();
		const res = await fetch(query_url.toString());
		if (res.ok) {
			let dat = res.json();
			console.log(dat);
			return dat;
		} else {
			throw new Error(await res.text());
		}
	}

	const handleConnectDb = _ => {
		connectRes = connectToDb(dbConfig);
	};
	const handleGetQuery = _ => (queryResult = getQueryResult(query));
</script>

<main>
	<h1>Monocle</h1>
	<div class="fields">
		<p class="field-label">Monocle Server:</p>
		<input bind:value={clientUrl} />
		<div />
		<p class="field-label">PostgreSQL Database Username:</p>
		<input
			bind:value={dbConfig.username}
			on:keypress={event => event.key === "Enter" && handleConnectDb(event)}
		/>
		<div />
		<p class="field-label">PostgreSQL Database Server:</p>
		<input
			bind:value={dbConfig.host}
			on:keypress={event => event.key === "Enter" && handleConnectDb(event)}
		/>
		<div />
		<p class="field-label">PostgreSQL Database Port:</p>
		<input
			bind:value={dbConfig.port}
			on:keypress={event => event.key === "Enter" && handleConnectDb(event)}
		/>
		<div />
		<p class="field-label">PostgreSQL Database Name:</p>
		<input
			bind:value={dbConfig.db}
			on:keypress={event => event.key === "Enter" && handleConnectDb(event)}
		/>
		<div />
		<p class="field-label">PostgreSQL Database Password:</p>
		<input
			bind:value={dbConfig.password}
			type="password"
			on:keypress={event => event.key === "Enter" && handleConnectDb(event)}
		/>
		<button on:click|preventDefault={handleConnectDb}>Connect</button>
		<p class="field-label">Query:</p>
		<input
			bind:value={query}
			on:keypress={event => event.key === "Enter" && handleGetQuery(event)}
		/>
		<button on:click|preventDefault={handleGetQuery}>Query</button>
	</div>
	{#await connectRes}
		<p>loading</p>
	{:then res}
		<p>{res}</p>
	{:catch err}
		<p>{err}</p>
	{/await}

	{#await queryResult}
		<p>loading</p>
	{:then res}
		{#if !res}
			<p>{res}</p>
		{:else}
			<div class="data" style="--columns:{res.fields.length}; --rows:{res.rowCount}">
				{#each res.fields as field}
					<p class="cell">{field.name}</p>
				{/each}
				{#each res.rows as row}
					{#each res.fields as field}
						<p class="cell non-header">{row[field.name]}</p>
					{/each}
				{/each}
			</div>
		{/if}
	{:catch err}
		<p>{err}</p>
	{/await}
</main>

<style>
	.fields {
		display: grid;
		grid-template-columns: 45% 45% 10%;
	}

	.field-label {
		text-align: right;
		padding-right: 1em;
	}

	.data {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(var(--columns), 1fr);
		grid-template-rows: repeat(var(--rows), 5em);
	}

	.non-header {
		margin: 0;
	}

	.cell {
		border: 1px solid black;
		overflow-x: auto;
	}

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

