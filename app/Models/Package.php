<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Package extends Model
{
    //
    protected $fillable = [
        'title', 'country_id', 'sub_category_id', 'short_description', 'long_description', 'include', 'exclude', 'highlight', 'duration', 'difficulty', 'max_altitude', 'best_season', 'accommodation', 'meals', 'start_point', 'end_point', 'price', 'slug',
    ];

    // protected static function boot()
    // {
    //     parent::boot();

    //     static::creating(function ($package) {
    //         $slug = Str::slug($package->title);
    //         $originalSlug = $slug;
    //         $count = 1;

    //         while (self::where('slug', $slug)->exists()) {
    //             $slug = $originalSlug.'-'.$count;
    //             $count++;
    //         }

    //         $package->slug = $slug;
    //     });
    // }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($package) {
            $package->slug = self::generateUniqueSlug($package->title);
        });

        static::updating(function ($package) {
            if ($package->isDirty('title')) {
                $package->slug = self::generateUniqueSlug(
                    $package->title,
                    $package->id
                );
            }
        });
    }

    protected static function generateUniqueSlug($title, $ignoreId = null)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        $query = self::query();

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        while (
            $query->clone()
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $originalSlug.'-'.$count;
            $count++;
        }

        return $slug;
    }

    public function images()
    {
        return $this->hasMany(PackageImage::class);
    }

    public function itineraries()
    {
        return $this->hasMany(PackageItinerary::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    // public function packageCategories()
    // {
    //     return $this->hasMany(PackageCategory::class);
    // }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'package_categories');
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function faqs()
    {
        return $this->hasMany(Faq::class);
    }
}
