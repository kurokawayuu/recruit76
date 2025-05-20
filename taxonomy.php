<?php
/**
 * タクソノミーアーカイブテンプレート
 * すべてのタクソノミーアーカイブページに適用されます
 */
get_header();

// 現在のタクソノミー情報を取得
$term = get_queried_object();
$taxonomy = get_taxonomy($term->taxonomy);
?>



<script>
// DOM読み込み後にサイドバーを強制的に非表示
document.addEventListener('DOMContentLoaded', function() {
    // サイドバーを非表示
    var sidebarElements = document.querySelectorAll('#sidebar, .sidebar, #secondary, .widget-area');
    sidebarElements.forEach(function(element) {
        element.style.display = 'none';
    });
    
    // メインコンテンツを100%幅に
    var mainElements = document.querySelectorAll('#main, .main, #primary, .content-area, .container');
    mainElements.forEach(function(element) {
        element.style.width = '100%';
        element.style.maxWidth = '100%';
        element.style.float = 'none';
    });
});
</script>

<div class="content-wrapper full-width">
    <div class="container">
        <!-- 検索フォームを表示 -->
        <?php get_template_part('search', 'form'); ?>
        
        <!-- 検索タイトル -->
        <div class="search-results-header">
            <h1 class="search-results-title">
                <?php 
                // タクソノミーに応じたタイトルを表示
                switch ($term->taxonomy) {
                    case 'job_location':
                        echo esc_html($term->name) . 'の求人・転職・アルバイト情報';
                        break;
                    case 'job_position':
                        echo esc_html($term->name) . 'の求人・転職・アルバイト情報';
                        break;
                    case 'job_type':
                        echo esc_html($term->name) . 'の求人・転職・アルバイト情報';
                        break;
                    case 'facility_type':
                        echo esc_html($term->name) . 'の求人・転職・アルバイト情報';
                        break;
                    case 'job_feature':
                        echo esc_html($term->name) . 'の求人・転職・アルバイト情報';
                        break;
                    default:
                        echo '求人・転職・アルバイト情報';
                        break;
                }
                ?>
            </h1>
            
            <div class="job-count">
                <p>検索結果: <span class="count-number"><?php echo esc_html($wp_query->found_posts); ?></span>件</p>
            </div>
        </div>
        
        <!-- 求人カード一覧 -->
        <div class="job-cards-container">
            <?php if (have_posts()): ?>
                <?php while (have_posts()): the_post(); 
                    // カスタムフィールドデータの取得
                    $facility_name = get_post_meta(get_the_ID(), 'facility_name', true);
                    $facility_company = get_post_meta(get_the_ID(), 'facility_company', true);
                    $job_content_title = get_post_meta(get_the_ID(), 'job_content_title', true);
                    $salary_range = get_post_meta(get_the_ID(), 'salary_range', true);
                    $facility_address = get_post_meta(get_the_ID(), 'facility_address', true);
                    
                    // タクソノミーの取得
                    $facility_types = get_the_terms(get_the_ID(), 'facility_type');
                    $job_features = get_the_terms(get_the_ID(), 'job_feature');
                    $job_types = get_the_terms(get_the_ID(), 'job_type');
                    $job_positions = get_the_terms(get_the_ID(), 'job_position');
                    
                    // 施設形態のチェック
$has_jidou = false;    // 児童発達支援フラグ
$has_houkago = false;  // 放課後等デイサービスフラグ

if ($facility_types && !is_wp_error($facility_types)) {
    foreach ($facility_types as $type) {
        // 組み合わせタイプのチェック
        if ($type->slug === 'jidou-houkago') {
            // 児童発達支援・放課後等デイの場合は両方表示
            $has_jidou = true;
            $has_houkago = true;
        } 
        // 児童発達支援のみのチェック
        else if ($type->slug === 'jidou') {
            $has_jidou = true;
        } 
        // 放課後等デイサービスのみのチェック
        else if ($type->slug === 'houkago') {
            $has_houkago = true;
        }
        
        // 従来の拡張スラッグもサポート（必要に応じて）
        else if (in_array($type->slug, ['jidou-hattatsu', 'jidou-hattatsu-shien', 'child-development-support'])) {
            $has_jidou = true;
        }
        else if (in_array($type->slug, ['houkago-day', 'houkago-dayservice', 'after-school-day-service'])) {
            $has_houkago = true;
        }
    }
}
                    
                    // 雇用形態に基づくカラークラスを設定
$employment_color_class = 'other'; // デフォルトはその他
if ($job_types && !is_wp_error($job_types)) {
    // スラッグによる判定
    $job_type_slug = $job_types[0]->slug;
    $job_type_name = $job_types[0]->name;
    
    // スラッグベースでの判定
    switch($job_type_slug) {
        case 'full-time':
        case 'seishain': // 正社員
            $employment_color_class = 'full-time';
            break;
        case 'part-time':
        case 'part':
        case 'arubaito': // パート・アルバイト
            $employment_color_class = 'part-time';
            break;
        default:
            // スラッグで判定できない場合は名前で判定
            if ($job_type_name === '正社員') {
                $employment_color_class = 'full-time';
            } else if ($job_type_name === 'パート・アルバイト' || 
                      strpos($job_type_name, 'パート') !== false || 
                      strpos($job_type_name, 'アルバイト') !== false) {
                $employment_color_class = 'part-time';
            } else {
                $employment_color_class = 'other';
            }
            break;
    }
}
                ?>
                
                <div class="job-card">
                    <!-- 上部コンテンツ：左右に分割 -->
                    <div class="job-content">
                        <!-- 左側：サムネイル画像、施設形態アイコン、特徴タグ -->
                        <div class="left-content">
                            <!-- サムネイル画像 -->
                            <div class="job-image">
                                <?php if (has_post_thumbnail()): ?>
                                    <?php the_post_thumbnail('medium'); ?>
                                <?php else: ?>
                                    <img src="https://via.placeholder.com/300x200" alt="<?php echo esc_attr($facility_name); ?>">
                                <?php endif; ?>
                            </div>
                            
                            <!-- 施設形態を画像アイコン -->
                            <div class="facility-icons">
                                <?php if ($has_houkago): ?>
                                <!-- 放デイアイコン -->
                                <div class="facility-icon">
                                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/img/day.png" alt="放デイ">
                                </div>
                                <?php endif; ?>
                                
                                <?php if ($has_jidou): ?>
                                <!-- 児発支援アイコン -->
                                <div class="facility-icon red-icon">
                                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/img/support.png" alt="児発支援">
                                </div>
                                <?php endif; ?>
                            </div>
                            
                            <!-- 特徴タクソノミータグ - 3つまで表示 -->
                            <?php if ($job_features && !is_wp_error($job_features)): ?>
                            <div class="tags-container">
                                <?php 
                                $features_count = 0;
                                foreach ($job_features as $feature):
                                    if ($features_count < 3):
                                        // プレミアム特徴の判定（例：高収入求人など）
                                        $premium_class = (in_array($feature->slug, ['high-salary', 'bonus-available'])) ? 'premium' : '';
                                ?>
                                    <span class="tag <?php echo $premium_class; ?>"><?php echo esc_html($feature->name); ?></span>
                                <?php
                                        $features_count++;
                                    endif;
                                endforeach; 
                                ?>
                            </div>
                            <?php endif; ?>
                        </div>
                        
                        <!-- 右側：運営会社名、施設名、本文詳細 -->
                        <div class="right-content">
                            <!-- 会社名と雇用形態を横に並べる -->
                            <div class="company-section">
                                <span class="company-name"><?php echo esc_html($facility_company); ?></span>
                                <?php if ($job_types && !is_wp_error($job_types)): ?>
                                <div class="employment-type <?php echo $employment_color_class; ?>">
                                    <?php echo esc_html($job_types[0]->name); ?>
                                </div>
                                <?php endif; ?>
                            </div>
                            
                            <!-- 施設名を会社名の下に配置 -->
                            <h1 class="job-title"><?php echo esc_html($facility_name); ?></h1>
                            
                            <h2 class="job-subtitle"><?php echo esc_html($job_content_title); ?></h2>
                            
                            <p class="job-description">
    <?php echo wp_trim_words(get_the_content(), 100, '...'); ?>
</p>
                            
                            <!-- 本文の下に区切り線を追加 -->
                            <div class="divider"></div>
                            
                            <!-- 職種、給料、住所情報 -->
                            <div class="job-info">
                                <?php if ($job_positions && !is_wp_error($job_positions)): ?>
                                <div class="info-item">
                                    <span class="info-icon"><i class="fa-solid fa-user"></i></span>
                                    <span><?php echo esc_html($job_positions[0]->name); ?></span>
                                </div>
                                <?php endif; ?>
                                
                                <div class="info-item">
    <span class="info-icon"><i class="fa-solid fa-money-bill-wave"></i></span>
    <span>
        <?php 
            $salary_range = get_post_meta(get_the_ID(), 'salary_range', true);
            $salary_type = get_post_meta(get_the_ID(), 'salary_type', true);
            
            // 賃金形態の表示（月給/時給）
            if ($salary_type === 'MONTH') {
                echo '月給 ';
            } elseif ($salary_type === 'HOUR') {
                echo '時給 ';
            }
            
            echo esc_html($salary_range);
            
            // 円表示がなければ追加
            if (mb_strpos($salary_range, '円') === false) {
                echo '円';
            }
        ?>
    </span>
</div>
                                
                                <div class="info-item">
                                    <span class="info-icon"><i class="fa-solid fa-location-dot"></i></span>
                                    <span><?php echo esc_html($facility_address); ?></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 区切り線 -->
                    <div class="divider"></div>
                    
                    <!-- ボタンエリア -->
                    <div class="buttons-container">
                        <?php if (is_user_logged_in()): 
                            // お気に入り状態の確認
$user_id = get_current_user_id();
$favorites = get_user_meta($user_id, 'user_favorites', true);
$is_favorite = is_array($favorites) && in_array(get_the_ID(), $favorites);
                        ?>
                            <button class="keep-button <?php echo $is_favorite ? 'kept' : ''; ?>" data-job-id="<?php echo get_the_ID(); ?>">
    <span class="star"><i class="fa-solid fa-star"></i></span>
    <?php echo $is_favorite ? 'キープ済み' : 'キープ'; ?>
</button>
                        <?php else: ?>
                            <a href="<?php echo home_url('/register/'); ?>" class="keep-button">
                                <span class="star"></span>キープ
                            </a>
                        <?php endif; ?>
                        
                        <a href="<?php the_permalink(); ?>" class="detail-view-button">詳細をみる</a>
                    </div>
                </div>
                <?php endwhile; ?>
                
                <!-- ページネーション -->
                <div class="pagination">
                    <?php
                    echo paginate_links(array(
                        'prev_text' => '&laquo; 前へ',
                        'next_text' => '次へ &raquo;',
                    ));
                    ?>
                </div>
                
            <?php else: ?>
                <div class="no-jobs-found">
                    <p>条件に一致する求人が見つかりませんでした。検索条件を変更して再度お試しください。</p>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- 関連リンク（人気の検索条件） -->
        <div class="related-searches">
            <h3>人気の検索条件</h3>
            <div class="popular-searches">
                <?php
                // 人気のある職種を取得
                $popular_positions = get_terms(array(
                    'taxonomy' => 'job_position',
                    'orderby' => 'count',
                    'order' => 'DESC',
                    'number' => 5,
                    'hide_empty' => true,
                ));
                
                if (!empty($popular_positions) && !is_wp_error($popular_positions)) {
                    foreach ($popular_positions as $position) {
                        $url = home_url('/jobs/position/' . $position->slug . '/');
                        echo '<a href="' . esc_url($url) . '" class="popular-search-link">' . esc_html($position->name) . '</a>';
                    }
                }
                
                // 人気のあるエリアを取得
                $popular_locations = get_terms(array(
                    'taxonomy' => 'job_location',
                    'orderby' => 'count',
                    'order' => 'DESC',
                    'number' => 5,
                    'hide_empty' => true,
                ));
                
                if (!empty($popular_locations) && !is_wp_error($popular_locations)) {
                    foreach ($popular_locations as $location) {
                        $url = home_url('/jobs/location/' . $location->slug . '/');
                        echo '<a href="' . esc_url($url) . '" class="popular-search-link">' . esc_html($location->name) . '</a>';
                    }
                }
                ?>
            </div>
        </div>
    </div>
</div>

<!-- キープボタン用JavaScriptコード -->
<!-- キープボタン用JavaScriptコード -->
<script>
jQuery(document).ready(function($) {
    // キープボタン機能
    $('.keep-button').on('click', function() {
        // リンクでない場合のみ処理（ログイン済みユーザー用）
        if (!$(this).attr('href')) {
            var jobId = $(this).data('job-id');
            var $button = $(this);
            
            // AJAXでキープ状態を切り替え
            $.ajax({
                url: '<?php echo admin_url('admin-ajax.php'); ?>',
                type: 'POST',
                data: {
                    action: 'toggle_job_favorite',
                    job_id: jobId,
                    nonce: '<?php echo wp_create_nonce('job_favorite_nonce'); ?>'
                },
                success: function(response) {
                    if (response.success) {
                        if (response.data.status === 'added') {
                            $button.addClass('kept');
                            $button.html('<span class="star"><i class="fa-solid fa-star"></i></span> キープ済み');
                        } else {
                            $button.removeClass('kept');
                            $button.html('<span class="star"><i class="fa-solid fa-star"></i></span> キープ');
                        }
                    }
                }
            });
        }
    });
});
</script>



<?php get_footer(); ?>