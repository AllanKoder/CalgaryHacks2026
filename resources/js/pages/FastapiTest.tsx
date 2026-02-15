import { Head, usePage } from '@inertiajs/react';
import React from 'react';

export default function FastapiTest() {
    const props: any = usePage().props;
    const api = props.api ?? null;
    const info = props.info ?? null;

    return (
        <>
            <Head title="FastAPI Test" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">FastAPI Test</h1>
                <section className="mb-4">
                    <h2 className="font-medium">/predict response</h2>
                    <pre className="whitespace-pre-wrap bg-slate-100 p-4 rounded">{JSON.stringify(api, null, 2)}</pre>
                </section>
                <section>
                    <h2 className="font-medium">/info response</h2>
                    <pre className="whitespace-pre-wrap bg-slate-100 p-4 rounded">{JSON.stringify(info, null, 2)}</pre>
                </section>
            </div>
        </>
    );
}
