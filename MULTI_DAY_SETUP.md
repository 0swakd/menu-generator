# Multi-Day Dish Feature Setup

## Overview
This update adds support for multi-day dishes (like pies, casseroles) that can be eaten over multiple meals. A dish prepared once can now provide multiple servings across several days.

## Database Migration Required

**IMPORTANT**: You need to run the SQL migration to add the new database columns.

### Steps to apply the migration:

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Run the SQL Migration**
   - Go to the "SQL Editor" section
   - Copy and paste the content from `migrations/add_multi_day_support.sql`
   - Execute the query

3. **Verify the Migration**
   - Check that the following columns were added to your `dishes` table:
     - `servings_per_dish` (INTEGER, default 1)
     - `servings_per_person` (INTEGER, default 1) 
     - `can_be_multi_day` (BOOLEAN, default false)
     - `storage_days` (INTEGER, default 1)

## Features Added

### 1. **Enhanced Dish Types**
- **Regular dishes**: Single-serving dishes consumed in one meal
- **Multi-day dishes**: Dishes that provide multiple servings over several days
  - Example: A pie with 8 servings for 1 person = 8 potential meals
  - Example: A lasagne with 6 servings for 2 people = 3 meals for the family

### 2. **Smart Menu Generation**
- The system now considers dish capacity when generating menus
- Multi-day dishes are intelligently planned across consecutive meals
- Reduces cooking effort by maximizing multi-day dish usage
- Shows remaining servings and storage days for each dish

### 3. **Enhanced UI Components**
- **MenuDisplay**: Shows multi-day dish information including:
  - Portions used vs remaining
  - Days remaining for consumption
  - Special "Multi-jour" badge
  
- **AddDishForm**: New section "Gestion multi-jours" with fields:
  - Portions per dish (how many servings the dish provides)
  - Portions per person (how many servings one person eats per meal)
  - Storage days (maximum days the dish can be kept)
  - Multi-day checkbox (whether dish can span multiple days)

### 4. **Backward Compatibility**
- Existing dishes automatically get default values (1 serving, 1 day)
- The system supports both old string[] dish format and new MenuDish[] format
- All existing menus continue to work without changes

## Example Use Cases

### Scenario 1: Single Person Setup
- **Dish**: Apple Pie
- **Servings per dish**: 8
- **Servings per person**: 1
- **Storage days**: 3
- **Result**: One pie provides dessert for 8 meals over 3 days

### Scenario 2: Family Setup
- **Dish**: Lasagne
- **Servings per dish**: 6
- **Servings per person**: 1
- **People**: 3
- **Result**: One lasagne provides dinner for 2 meals (6÷3=2 meals)

### Scenario 3: Regular Dish
- **Dish**: Grilled Salmon
- **Servings per dish**: 1
- **Servings per person**: 1
- **Can be multi-day**: false
- **Result**: Traditional single-meal dish behavior

## Testing the Feature

1. **Add a multi-day dish**:
   - Go to "Manage Dishes"
   - Add a new dish like "Tarte aux pommes"
   - Set servings_per_dish to 8, servings_per_person to 1
   - Check "can be multi-day" 
   - Set storage_days to 3

2. **Generate a menu**:
   - Set people to 1, meals to 5
   - The system should intelligently use the pie across multiple meals

3. **Verify the display**:
   - Check that multi-day dishes show portion information
   - Verify the "Multi-jour" badge appears
   - Confirm remaining servings are calculated correctly

## Files Modified

### Core Types (`src/types/index.ts`)
- Added multi-day fields to `Dish` interface
- Created `MenuDish` interface for detailed dish tracking
- Updated `MenuMeal` to support both string[] and MenuDish[]

### API Endpoints
- `generate-menu/route.ts`: Enhanced with multi-day logic
- `quick-add-dish/route.ts`: Updated to include new fields
- `auto-fill-dish/route.ts`: Now suggests multi-day values

### UI Components  
- `MenuDisplay.tsx`: Shows multi-day dish information
- `AddDishForm.tsx`: Added multi-day management section

### Database
- `migrations/add_multi_day_support.sql`: Database schema update

This feature significantly enhances the menu planning capability by reducing cooking effort and better representing real-world dish usage patterns.