<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class VectorSetup extends Command
{
    protected $signature = 'vector:setup';
    protected $description = 'Setup vector search (migration-based, no external service needed)';

    public function handle()
    {
        $this->info('Vector search uses SQLite with JSON embeddings.');
        $this->info('Run migrations to add embedding column:');
        $this->newLine();
        $this->line('php artisan migrate');
        $this->newLine();
        $this->info('Then run: php artisan vector:reindex');
        
        return Command::SUCCESS;
    }
}
