use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->get('/me', function (Request $request) {
    return $request->user();
});
