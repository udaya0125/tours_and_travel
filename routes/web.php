<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\FaqController;

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

    Route::get('/categories',function(){
        return Inertia::render('NavPages/Category');
    });   

    Route::get('/ourcategories', [CategoryController::class, 'index'])->name('ourcategories.index');
    Route::post('/ourcategories', [CategoryController::class, 'store'])->name('ourcategories.store');
    Route::put('/ourcategories/{id}', [CategoryController::class, 'update'])->name('ourcategories.update');
    Route::delete('/ourcategories/{id}', [CategoryController::class, 'destroy'])->name('ourcategories.destroy');


    Route::get('/subcategories',function(){
        return Inertia::render('NavPages/SubCategory');
    }); 

    Route::get('/oursubcategories', [SubCategoryController::class, 'index'])->name('oursubcategories.index');
    Route::post('/oursubcategories', [SubCategoryController::class, 'store'])->name('oursubcategories.store');
    Route::put('/oursubcategories/{id}', [SubCategoryController::class, 'update'])->name('oursubcategories.update');
    Route::delete('/oursubcategories/{id}', [SubCategoryController::class, 'destroy'])->name('oursubcategories.destroy');

    Route::get('/package',function(){
        return Inertia::render('NavPages/Package');
    }); 

    Route::get('/ourpackages', [PackageController::class, 'index'])->name('ourpackages.index');
    Route::post('/ourpackages', [PackageController::class, 'store'])->name('ourpackages.store');
    Route::put('/ourpackages/{id}', [PackageController::class, 'update'])->name('ourpackages.update');
    Route::delete('/ourpackages/{id}', [PackageController::class, 'destroy'])->name('ourpackages.destroy');
    // Single image delete
Route::delete('/packages/{packageId}/images/{imageId}', [PackageController::class, 'destroyImage']);

// Bulk image delete
Route::delete('/packages/{packageId}/images', [PackageController::class, 'destroyImages']);

    Route::get('/faqs',function(){
        return Inertia::render('NavPages/FAQ');
    }); 

    Route::get('/ourfaqs', [FAQController::class, 'index'])->name('ourfaqs.index');
    Route::post('/ourfaqs', [FAQController::class, 'store'])->name('ourfaqs.store');
    Route::put('/ourfaqs/{id}', [FAQController::class, 'update'])->name('ourfaqs.update');
    Route::delete('/ourfaqs/{id}', [FAQController::class, 'destroy'])->name('ourfaqs.destroy');

});    

require __DIR__.'/auth.php';
