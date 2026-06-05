<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CountryController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


    // ###############################################################################################################
    //  Authenticated Routes (Only accessible to logged-in users)
    // ################################################################################################################

    Route::middleware('auth')->group(function () {

    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    // Page Routes for Welcome Page
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    Route::get('/',function(){
        return Inertia::render('AdminPages/Welcome');
    });


    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    // Page Routes for User Management Page
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    Route::get('/user-management',function(){
        return Inertia::render('AdminPages/UserManagement');
    });


    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    // Page Routes for Activity Logs Page
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    
    
    Route::get('/activity-logs',function(){
        return Inertia::render('AdminPages/ActivityLogs');
    });

    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    // Page Routes for Country Page
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    Route::get('/countries',function(){
        return Inertia::render('NavPages/Country');
    });

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // Controller Routes for Country Page
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    Route::get('/ourcountries', [CountryController::class, 'index'])->name('ourcountries.index');
    Route::post('/ourcountries', [CountryController::class, 'store'])->name('ourcountries.store');
    Route::put('/ourcountries/{id}', [CountryController::class, 'update'])->name('ourcountries.update');
    Route::delete('/ourcountries/{id}', [CountryController::class, 'destroy'])->name('ourcountries.destroy');

});    

require __DIR__.'/auth.php';
