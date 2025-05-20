//ここに追加したいJavaScript、jQueryを記入してください。
//このJavaScriptファイルは、親テーマのJavaScriptファイルのあとに呼び出されます。
//JavaScriptやjQueryで親テーマのjavascript.jsに加えて関数を記入したい時に使用します。

/**
 * 無限ループカルーセルスライダー（左右のスライドが見えるバージョン）
 */
document.addEventListener('DOMContentLoaded', function() {
  // 覗き見スライダー
  const slider = document.querySelector('.peek-slider-container');
  const slides = document.querySelectorAll('.peek-slide');
  const prevButton = document.querySelector('.peek-slider-button.prev');
  const nextButton = document.querySelector('.peek-slider-button.next');
  const dots = document.querySelectorAll('.peek-slider-dot');
  
  if (!slider || slides.length === 0) return;
  
  let currentIndex = 0;
  const slideCount = slides.length;
  let autoplayTimer = null;
  
  // クローンを作成してスライダーの前後に追加
  function setupInfiniteLoop() {
    // 各スライドにIDを追加する
    slides.forEach((slide, index) => {
      slide.setAttribute('data-index', index);
    });
    
    // 最初のスライドのクローンを作成して最後に追加
    const firstSlideClone = slides[0].cloneNode(true);
    firstSlideClone.setAttribute('data-clone', 'true');
    slider.appendChild(firstSlideClone);
    
    // 最後のスライドのクローンを作成して最初に追加
    const lastSlideClone = slides[slideCount - 1].cloneNode(true);
    lastSlideClone.setAttribute('data-clone', 'true');
    slider.insertBefore(lastSlideClone, slides[0]);
    
    // 初期位置を調整（クローンを考慮して1つ右にずらす）
    currentIndex = 1;
    updateSlider(false);
  }
  
  // スライドを更新
  function updateSlider(withTransition = true) {
    // トランジションの有無を設定
    if (withTransition) {
      slider.style.transition = 'transform 0.5s ease';
    } else {
      slider.style.transition = 'none';
    }
    
    // スライド全体の幅を考慮
    // 各スライドの幅はCSSで設定（デフォルト80%、小画面では70%）
    // 実際の移動量は1スライドあたり100%
    slider.style.transform = `translateX(${-currentIndex * 100}%)`;
    
    // 実際のインデックス（クローンを除く）を計算
    const realIndex = (currentIndex - 1 + slideCount) % slideCount;
    
    // ドットを更新
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === realIndex);
    });
    
    // アクティブスライドのクラスを更新（必要な場合）
    const allSlides = document.querySelectorAll('.peek-slide');
    allSlides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });
  }
  
  // 次のスライドへ
  function goToNextSlide() {
    currentIndex++;
    updateSlider();
    
    // 最後のクローンに到達したら、トランジション後に最初のスライドに瞬時に戻す
    if (currentIndex === slideCount + 1) {
      setTimeout(() => {
        currentIndex = 1;
        updateSlider(false);
      }, 500);
    }
  }
  
  // 前のスライドへ
  function goToPrevSlide() {
    currentIndex--;
    updateSlider();
    
    // 最初のクローンに到達したら、トランジション後に最後のスライドに瞬時に戻す
    if (currentIndex === 0) {
      setTimeout(() => {
        currentIndex = slideCount;
        updateSlider(false);
      }, 500);
    }
  }
  
  // 特定のスライドへ移動（ドットクリック用）
  function goToSlide(index) {
    // インデックスを実際のスライド位置に変換（クローンを考慮）
    currentIndex = index + 1;
    updateSlider();
  }
  
  // 自動再生の開始
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(goToNextSlide, 5000);
  }
  
  // 自動再生の停止
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }
  
  // イベントリスナーの追加
  prevButton.addEventListener('click', function() {
    goToPrevSlide();
    stopAutoplay();
    startAutoplay();
  });
  
  nextButton.addEventListener('click', function() {
    goToNextSlide();
    stopAutoplay();
    startAutoplay();
  });
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      goToSlide(index);
      stopAutoplay();
      startAutoplay();
    });
  });
  
  // トランジション終了時のイベント
  slider.addEventListener('transitionend', function() {
    // 最後のクローンに到達したら、最初のスライドに瞬時に戻す
    if (currentIndex === slideCount + 1) {
      currentIndex = 1;
      updateSlider(false);
    }
    // 最初のクローンに到達したら、最後のスライドに瞬時に戻す
    else if (currentIndex === 0) {
      currentIndex = slideCount;
      updateSlider(false);
    }
  });
  
  // タッチスワイプの処理
  let touchStartX = 0;
  let touchEndX = 0;
  
  slider.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].clientX;
    stopAutoplay();
  }, { passive: true });
  
  slider.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
    startAutoplay();
  }, { passive: true });
  
  function handleSwipe() {
    const SWIPE_THRESHOLD = 50;
    if (touchStartX - touchEndX > SWIPE_THRESHOLD) {
      goToNextSlide();
    } else if (touchEndX - touchStartX > SWIPE_THRESHOLD) {
      goToPrevSlide();
    }
  }
  
  // ウィンドウサイズ変更時に更新
  window.addEventListener('resize', function() {
    updateSlider(false);
  });
  
  // 初期化
  setupInfiniteLoop();
  startAutoplay();
});
/**
 * 求人検索フォーム用のJavaScript
 */
jQuery(document).ready(function($) {
    console.log('求人検索スクリプトを読み込みました'); // デバッグ用
    
    // グローバル変数を定義
    var ajaxurl = job_search_params.ajax_url;
    var site_url = job_search_params.site_url;
    
    // 現在の日付を設定
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    $('#update-date').text(year + '年' + month + '月' + day + '日');
    
    // 詳細検索の表示/非表示切り替え
    $('#detail-toggle-btn').on('click', function() {
        var $detailSection = $('.detail-search-section');
        if ($detailSection.is(':visible')) {
            $detailSection.slideUp();
            $(this).text('詳細を指定');
        } else {
            $detailSection.slideDown();
            $(this).text('詳細条件を閉じる');
        }
    });
    
    // 選択フィールドをクリックしたときの処理
    $('#area-field').on('click', function() {
        console.log('エリアフィールドがクリックされました'); // デバッグ用
        openModal('area-modal-overlay');
        // 最初のステップを表示
        $('#area-selection-modal').show();
        $('#prefecture-selection-modal').hide();
        $('#city-selection-modal').hide();
    });
    
    $('#position-field').on('click', function() {
        console.log('職種フィールドがクリックされました'); // デバッグ用
        openModal('position-modal-overlay');
    });
    
    $('#job-type-field').on('click', function() {
        console.log('雇用形態フィールドがクリックされました'); // デバッグ用
        openModal('job-type-modal-overlay');
    });
    
    $('#facility-type-field').on('click', function() {
        console.log('施設形態フィールドがクリックされました'); // デバッグ用
        openModal('facility-type-modal-overlay');
    });
    
    $('#feature-field').on('click', function() {
        console.log('特徴フィールドがクリックされました'); // デバッグ用
        // チェックボックスの状態を初期化
        resetFeatureCheckboxes();
        openModal('feature-modal-overlay');
    });
    
    // モーダルを開く
    function openModal(modalId) {
        console.log('モーダルを開きます: ' + modalId); // デバッグ用
        // すべてのモーダルを非表示にする
        $('.modal-overlay').removeClass('active');
        
        // 指定されたモーダルのみ表示する
        $('#' + modalId).addClass('active');
    }
    
    // モーダルを閉じる
    $('.modal-close').on('click', function() {
        var target = $(this).data('target');
        $('#' + target).removeClass('active'); // activeクラスを削除
    });
    
    // 背景クリックでモーダルを閉じる
    $('.modal-overlay').on('click', function(e) {
        if ($(e.target).is('.modal-overlay')) {
            $(this).removeClass('active'); // activeクラスを削除
        }
    });
    
    // トップレベルのエリア選択時の処理
    $(document).on('click', '.area-btn', function() {
        var termId = $(this).data('term-id');
        var termName = $(this).data('name');
        var termSlug = $(this).data('slug');
        
        // エリア情報を一時保存
        sessionStorage.setItem('selectedAreaId', termId);
        sessionStorage.setItem('selectedAreaName', termName);
        sessionStorage.setItem('selectedAreaSlug', termSlug);
        
        // 選択したエリア名を表示
        $('#selected-area-name').text(termName);
        $('#selected-area-btn-name').text(termName);
        
        // 第2階層のタームをロード
        loadSecondLevelTerms(termId);
        
        // モーダルを切り替え
        $('#area-selection-modal').hide();
        $('#prefecture-selection-modal').fadeIn(300);
    });
    
    // 「全域で検索」ボタン（第1階層）の処理
    $('#select-area-btn').on('click', function() {
        var areaName = sessionStorage.getItem('selectedAreaName');
        var areaSlug = sessionStorage.getItem('selectedAreaSlug');
        var areaId = sessionStorage.getItem('selectedAreaId');
        
        // URLを構築するために使用するTermオブジェクトを取得
        var termUrl = getTermUrl('job_location', areaId);
        
        // 表示テキストを更新
        updateSelectionDisplay('#area-field', areaName);
        
        // hidden inputに値をセット
        $('#location-input').val(areaSlug);
        $('#location-name-input').val(areaName);
        $('#location-term-id-input').val(areaId);
        
        // 第1階層のURLを保存
        sessionStorage.setItem('selectedLocationUrl', termUrl);
        
        // モーダルを閉じる
        $('#area-modal-overlay').removeClass('active');
    });
    
    // 第2階層のターム選択時の処理
    $(document).on('click', '.prefecture-btn', function() {
        var termId = $(this).data('term-id');
        var termName = $(this).data('name');
        var termSlug = $(this).data('slug');
        
        // 都道府県情報を一時保存
        sessionStorage.setItem('selectedPrefectureId', termId);
        sessionStorage.setItem('selectedPrefectureName', termName);
        sessionStorage.setItem('selectedPrefectureSlug', termSlug);
        
        // URLを構築するために使用するTermオブジェクトを取得
        var termUrl = getTermUrl('job_location', termId);
        sessionStorage.setItem('selectedPrefectureUrl', termUrl);
        
        // 選択した都道府県名を表示
        $('#selected-prefecture-name').text(termName);
        $('#selected-prefecture-btn-name').text(termName);
        
        // 第3階層の市区町村タームを取得
        loadThirdLevelTerms(termId);
        
        // モーダルを切り替え
        $('#prefecture-selection-modal').hide();
        $('#city-selection-modal').fadeIn(300);
    });
    
    // 「全域で検索」ボタン（第2階層）の処理
    $('#select-prefecture-btn').on('click', function() {
        var prefectureName = sessionStorage.getItem('selectedPrefectureName');
        var prefectureSlug = sessionStorage.getItem('selectedPrefectureSlug');
        var prefectureId = sessionStorage.getItem('selectedPrefectureId');
        
        // 表示テキストを更新
        updateSelectionDisplay('#area-field', prefectureName);
        
        // hidden inputに値をセット
        $('#location-input').val(prefectureSlug);
        $('#location-name-input').val(prefectureName);
        $('#location-term-id-input').val(prefectureId);
        
        // モーダルを閉じる
        $('#area-modal-overlay').removeClass('active');
    });
    
    // 第3階層のターム選択時の処理
    $(document).on('click', '.city-btn', function() {
        var termId = $(this).data('term-id');
        var termName = $(this).data('name');
        var termSlug = $(this).data('slug');
        var prefectureName = sessionStorage.getItem('selectedPrefectureName');
        
        // URLを構築するために使用するTermオブジェクトを取得
        var termUrl = getTermUrl('job_location', termId);
        
        // 表示テキストを更新
        var displayText = prefectureName + ' ' + termName;
        updateSelectionDisplay('#area-field', displayText);
        
        // hidden inputに値をセット
        $('#location-input').val(termSlug);
        $('#location-name-input').val(displayText);
        $('#location-term-id-input').val(termId);
        
        // 市区町村のURLを保存
        sessionStorage.setItem('selectedLocationUrl', termUrl);
        
        // モーダルを閉じる
        $('#area-modal-overlay').removeClass('active');
    });
    
    // 職種選択時の処理
    $(document).on('click', '.position-btn', function() {
        var termId = $(this).data('term-id');
        var termName = $(this).data('name');
        var termSlug = $(this).data('slug');
        var termUrl = $(this).data('url');
        
        // 表示テキストを更新
        updateSelectionDisplay('#position-field', termName);
        
        // hidden inputに値をセット
        $('#position-input').val(termSlug);
        $('#position-name-input').val(termName);
        $('#position-term-id-input').val(termId);
        
        // URLを一時保存
        sessionStorage.setItem('selectedPositionUrl', termUrl);
        
        // モーダルを閉じる
        $('#position-modal-overlay').removeClass('active');
    });
    
    // 雇用形態選択時の処理
    $(document).on('click', '.job-type-btn', function() {
        var termId = $(this).data('term-id');
        var termName = $(this).data('name');
        var termSlug = $(this).data('slug');
        var termUrl = $(this).data('url');
        
        // 表示テキストを更新
        updateSelectionDisplay('#job-type-field', termName);
        
        // hidden inputに値をセット
        $('#job-type-input').val(termSlug);
        $('#job-type-name-input').val(termName);
        $('#job-type-term-id-input').val(termId);
        
        // URLを一時保存
        sessionStorage.setItem('selectedJobTypeUrl', termUrl);
        
        // モーダルを閉じる
        $('#job-type-modal-overlay').removeClass('active');
    });
    
    // 施設形態選択時の処理
    $(document).on('click', '.facility-type-btn', function() {
        var termId = $(this).data('term-id');
        var termName = $(this).data('name');
        var termSlug = $(this).data('slug');
        var termUrl = $(this).data('url');
        
        // 表示テキストを更新
        updateSelectionDisplay('#facility-type-field', termName);
        
        // hidden inputに値をセット
        $('#facility-type-input').val(termSlug);
        $('#facility-type-name-input').val(termName);
        $('#facility-type-term-id-input').val(termId);
        
        // URLを一時保存
        sessionStorage.setItem('selectedFacilityTypeUrl', termUrl);
        
        // モーダルを閉じる
        $('#facility-type-modal-overlay').removeClass('active');
    });
    
    // 特徴の適用ボタンの処理
    $('#apply-features-btn').on('click', function() {
        var selectedFeatures = [];
        var featureSlugs = [];
        var featureIds = [];
        
        // チェックされた特徴を取得
        $('.feature-checkbox:checked').each(function() {
            var termId = $(this).data('term-id');
            var termName = $(this).data('name');
            var termSlug = $(this).data('slug');
            
            selectedFeatures.push({
                id: termId,
                name: termName,
                slug: termSlug
            });
            
            featureSlugs.push(termSlug);
            featureIds.push(termId);
        });
        
        // 選択した特徴を表示
        updateFeatureSelection(selectedFeatures);
        
        // hidden inputに値をセット
        $('#job-feature-input').val(featureSlugs.join(','));
        
        // モーダルを閉じる
        $('#feature-modal-overlay').removeClass('active');
    });
    
    // 戻るボタンの処理
    $('.back-btn').on('click', function() {
        var target = $(this).data('target');
        
        // 現在のモーダルを非表示
        $(this).closest('.modal-panel').hide();
        
        // ターゲットモーダルを表示
        $('#' + target).fadeIn(300);
    });
    
    // 検索ボタンクリック時の処理
$('#search-btn').on('click', function() {
    console.log('検索ボタンがクリックされました'); // デバッグ用
    var baseUrl = site_url + '/jobs/';
    var filters = [];
    var queryParams = [];
    var hasPathFilters = false;
    
    // キーワード検索の処理を追加
    var keyword = $('#keyword-input').val().trim();
    if (keyword) {
        queryParams.push('s=' + encodeURIComponent(keyword));
    }
    
    // エリア
    var locationSlug = $('#location-input').val();
    if (locationSlug) {
        filters.push('location/' + locationSlug);
        hasPathFilters = true;
    }
    
    // 職種
    var positionSlug = $('#position-input').val();
    if (positionSlug) {
        filters.push('position/' + positionSlug);
        hasPathFilters = true;
    }
    
    // 詳細条件が表示されている場合
    if ($('.detail-search-section').is(':visible')) {
        // 雇用形態
        var jobTypeSlug = $('#job-type-input').val();
        if (jobTypeSlug) {
            filters.push('type/' + jobTypeSlug);
            hasPathFilters = true;
        }
        
        // 施設形態
        var facilityTypeSlug = $('#facility-type-input').val();
        if (facilityTypeSlug) {
            filters.push('facility/' + facilityTypeSlug);
            hasPathFilters = true;
        }
        
        // 特徴（複数選択をクエリパラメータとして扱う）
        var featureSlugStr = $('#job-feature-input').val();
        if (featureSlugStr) {
            var featureSlugs = featureSlugStr.split(',');
            if (featureSlugs.length === 1) {
                // 単一の特徴はURLパスに組み込む
                filters.push('feature/' + featureSlugs[0]);
                hasPathFilters = true;
            } else if (featureSlugs.length > 1) {
                // 複数の特徴はクエリパラメータとして処理
                for (var i = 0; i < featureSlugs.length; i++) {
                    queryParams.push('features[]=' + featureSlugs[i]);
                }
            }
        }
    }
    
    // 選択条件がなく、キーワード検索もない場合
    if (!hasPathFilters && queryParams.length === 0) {
        alert('検索条件またはキーワードを1つ以上入力してください');
        return;
    }
    
    // キーワードのみで検索する場合
    if (!hasPathFilters && keyword) {
        // WordPressの標準検索を使用
        window.location.href = site_url + '/?s=' + encodeURIComponent(keyword) + '&post_type=job';
        return;
    }
    
    // URLの構築
    var targetUrl;
    
    if (hasPathFilters) {
        // 主要条件がある場合は通常のパスベースURL
        targetUrl = baseUrl + filters.join('/') + '/';
    } else {
        // 特徴のみの場合は専用のエンドポイント
        targetUrl = baseUrl + 'features/';
    }
    
    // クエリパラメータを追加
    if (queryParams.length > 0) {
        targetUrl += '?' + queryParams.join('&');
    }
    
    console.log('生成されたURL:', targetUrl);
    
    // 検索結果ページに遷移
    window.location.href = targetUrl;
});
    
    // 選択表示の更新
    function updateSelectionDisplay(fieldSelector, text) {
        var $field = $(fieldSelector);
        $field.find('.selection-display').text(text);
        $field.find('.selection-display').removeClass('selection-placeholder');
    }
    
    // 特徴選択の表示を更新
    function updateFeatureSelection(features) {
        var $selectedFeatures = $('#selected-features');
        var $featureField = $('#feature-field');
        
        if (features.length === 0) {
            $featureField.find('.feature-selection-display').text('特徴を選択（複数選択可）');
            $featureField.find('.feature-selection-display').addClass('feature-placeholder');
            $selectedFeatures.empty();
            return;
        }
        
        $featureField.find('.feature-selection-display').text('選択済み：' + features.length + '件');
        $featureField.find('.feature-selection-display').removeClass('feature-placeholder');
        
        $selectedFeatures.empty();
        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var $tag = $('<div class="feature-tag">' + feature.name + '</div>');
            $selectedFeatures.append($tag);
        }
    }
    
    // 特徴チェックボックスのリセット
    function resetFeatureCheckboxes() {
        $('.feature-checkbox').prop('checked', false);
        
        // 現在選択されている特徴に基づいてチェックを復元
        var selectedFeatureSlugs = $('#job-feature-input').val();
        if (selectedFeatureSlugs) {
            var slugs = selectedFeatureSlugs.split(',');
            for (var i = 0; i < slugs.length; i++) {
                $('.feature-checkbox[data-slug="' + slugs[i] + '"]').prop('checked', true);
            }
        }
    }
    
    // 第2階層のタームをロードする関数
    function loadSecondLevelTerms(parentId) {
        $.ajax({
            url: ajaxurl,
            type: 'post',
            data: {
                action: 'get_taxonomy_children',
                parent_id: parentId,
                taxonomy: 'job_location',
                nonce: job_search_params.nonce
            },
            success: function(response) {
                if (response.success) {
                    displaySecondLevelTerms(response.data);
                } else {
                    $('#prefecture-grid').html('<p>階層が見つかりませんでした</p>');
                }
            },
            error: function() {
                $('#prefecture-grid').html('<p>エラーが発生しました</p>');
            }
        });
    }
    
    // 第2階層のタームを表示する関数
    function displaySecondLevelTerms(terms) {
        var $grid = $('#prefecture-grid');
        $grid.empty();
        
        if (terms.length === 0) {
            $grid.html('<p>該当するエリアがありません</p>');
            return;
        }
        
        for (var i = 0; i < terms.length; i++) {
            var term = terms[i];
            var $btn = $('<div class="prefecture-btn" data-term-id="' + term.term_id + '" data-name="' + term.name + '" data-slug="' + term.slug + '">' + term.name + '</div>');
            $grid.append($btn);
        }
    }
    
    // 第3階層のタームをロードする関数
    function loadThirdLevelTerms(parentId) {
        $.ajax({
            url: ajaxurl,
            type: 'post',
            data: {
                action: 'get_taxonomy_children',
                parent_id: parentId,
                taxonomy: 'job_location',
                nonce: job_search_params.nonce
            },
            success: function(response) {
                if (response.success) {
                    displayThirdLevelTerms(response.data);
                } else {
                    $('#city-grid').html('<p>市区町村が見つかりませんでした</p>');
                }
            },
            error: function() {
                $('#city-grid').html('<p>エラーが発生しました</p>');
            }
        });
    }
    
    // 第3階層のタームを表示する関数
    function displayThirdLevelTerms(terms) {
        var $grid = $('#city-grid');
        $grid.empty();
        
        if (terms.length === 0) {
            $grid.html('<p>該当する市区町村がありません</p>');
            return;
        }
        
        for (var i = 0; i < terms.length; i++) {
            var term = terms[i];
            var $btn = $('<div class="city-btn" data-term-id="' + term.term_id + '" data-name="' + term.name + '" data-slug="' + term.slug + '">' + term.name + '</div>');
            $grid.append($btn);
        }
    }
    
    // タクソノミーのURLを取得する関数
    function getTermUrl(taxonomy, termId) {
        var url = '';
        
        $.ajax({
            url: ajaxurl,
            type: 'post',
            async: false, // 同期リクエスト
            data: {
                action: 'get_term_link',
                term_id: termId,
                taxonomy: taxonomy,
                nonce: job_search_params.nonce
            },
            success: function(response) {
                if (response.success) {
                    url = response.data;
                }
            }
        });
        
        return url;
    }
});




/**
 * 新着求人情報カルーセル - 問題修正版
 * 前へ・次へボタンの除去、ドラッグスクロール対応、カード全体クリック対応
 */
jQuery(document).ready(function($) {
  // 必要な要素の取得
  const jobSliderWrapper = $('.job-slider-wrapper');
  const jobContainer = $('.job-container');
  const jobCards = $('.jo-card');
  const indicators = $('.indicator');
  
  // 既存のナビゲーションボタンを非表示に
  $('.next-job-btn, .prev-job-btn').hide();
  
  // 基本変数の初期化
  const cardWidth = jobCards.first().outerWidth(true);
  const containerWidth = jobSliderWrapper.width();
  const cardsPerView = Math.max(1, Math.floor(containerWidth / cardWidth));
  const totalCards = jobCards.length;
  const totalSlides = Math.ceil(totalCards / cardsPerView);
  let currentSlide = 0;
  
  // ドラッグ用変数
  let isMouseDown = false;
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  
  // 各カードをクリック可能に
  jobCards.each(function() {
    const $card = $(this);
    const detailLink = $card.find('.detail-btn').attr('href');
    
    if (detailLink) {
      // カードにポインタースタイルを適用
      $card.css('cursor', 'pointer');
      
      // カード全体のクリックイベント
      $card.on('click', function(e) {
        // リンク要素のクリックなら通常の動作を維持
        if ($(e.target).is('a') || $(e.target).parents('a').length > 0) {
          return;
        }
        
        // ドラッグ操作中でなければ詳細ページへ遷移
        if (!isDragging) {
          window.location.href = detailLink;
        }
      });
    }
  });
  
  // 指定したスライドに移動する関数
  function goToSlide(slideIndex) {
    currentSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));
    
    // 移動位置を計算
    const slideOffset = -currentSlide * (cardsPerView * cardWidth);
    
    // 右端に余白が出ないように調整
    const maxOffset = -((totalCards * cardWidth) - containerWidth);
    const adjustedOffset = Math.max(slideOffset, maxOffset);
    
    // スムーズなアニメーションでスライド
    jobContainer.css('transition', 'transform 0.3s ease-out');
    jobContainer.css('transform', `translateX(${adjustedOffset}px)`);
    
    // インジケーターの更新
    indicators.removeClass('active');
    indicators.eq(currentSlide).addClass('active');
  }
  
  // マウスダウン（ドラッグ開始）イベント - コンテナ限定
  jobContainer.on('mousedown', function(e) {
    e.preventDefault(); // テキスト選択を防止
    
    isMouseDown = true;
    isDragging = false;
    
    startX = e.pageX;
    startScrollLeft = parseInt(jobContainer.css('transform').split(',')[4]) || 0;
    
    // グラブスタイルを適用
    jobContainer.addClass('grabbing');
    // トランジションを一時的に無効化
    jobContainer.css('transition', 'none');
    
    // 自動再生停止
    stopAutoplay();
  });
  
  // マウスムーブ（ドラッグ中）イベント - ドキュメント全体
  $(document).on('mousemove', function(e) {
    // マウスダウン状態でなければ何もしない
    if (!isMouseDown) return;
    
    const x = e.pageX;
    const walk = (x - startX); // マウスの移動距離
    
    // 5px以上動いたらドラッグと判定
    if (Math.abs(walk) > 5) {
      isDragging = true;
    }
    
    if (isDragging) {
      // スクロール位置を更新
      const newScrollLeft = startScrollLeft + walk;
      
      // 左右の限界を設定（オーバースクロール防止）
      const maxScrollLeft = 0;
      const minScrollLeft = -((totalCards * cardWidth) - containerWidth);
      
      // 限界を超えた場合は抵抗を増す
      let adjustedScroll = newScrollLeft;
      if (newScrollLeft > maxScrollLeft) {
        adjustedScroll = maxScrollLeft + (newScrollLeft - maxScrollLeft) * 0.3;
      } else if (newScrollLeft < minScrollLeft) {
        adjustedScroll = minScrollLeft + (newScrollLeft - minScrollLeft) * 0.3;
      }
      
      // コンテナを移動
      jobContainer.css('transform', `translateX(${adjustedScroll}px)`);
    }
  });
  
  // マウスアップ（ドラッグ終了）イベント - ドキュメント全体
  $(document).on('mouseup mouseleave', function(e) {
    // マウスダウン状態でなければ何もしない
    if (!isMouseDown) return;
    
    isMouseDown = false;
    
    // スタイルを元に戻す
    jobContainer.removeClass('grabbing');
    jobContainer.css('transition', 'transform 0.3s ease-out');
    
    if (isDragging) {
      const walkDistance = e.pageX - startX;
      
      // 十分な距離をドラッグしたら次/前のスライドへ移動
      if (Math.abs(walkDistance) > cardWidth * 0.2) {
        if (walkDistance > 0 && currentSlide > 0) {
          // 右にドラッグ → 前のスライド
          currentSlide--;
        } else if (walkDistance < 0 && currentSlide < totalSlides - 1) {
          // 左にドラッグ → 次のスライド
          currentSlide++;
        }
      }
      
      // 現在のスライドに位置を合わせる
      goToSlide(currentSlide);
      
      // 時間をおいてドラッグ状態をリセット
      setTimeout(function() {
        isDragging = false;
      }, 100);
    } else {
      // ドラッグしなかった場合も位置を調整
      goToSlide(currentSlide);
    }
    
    // 自動再生再開
    startAutoplay();
  });
  
  // タッチイベント対応（モバイル用）
  jobContainer.on('touchstart', function(e) {
    isMouseDown = true;
    isDragging = false;
    
    startX = e.originalEvent.touches[0].pageX;
    startScrollLeft = parseInt(jobContainer.css('transform').split(',')[4]) || 0;
    
    jobContainer.addClass('grabbing');
    jobContainer.css('transition', 'none');
    
    stopAutoplay();
  });
  
  jobContainer.on('touchmove', function(e) {
    if (!isMouseDown) return;
    
    const x = e.originalEvent.touches[0].pageX;
    const walk = (x - startX);
    
    if (Math.abs(walk) > 5) {
      isDragging = true;
      e.preventDefault(); // スクロール防止（ドラッグ中のみ）
    }
    
    if (isDragging) {
      const newScrollLeft = startScrollLeft + walk;
      
      // 限界設定
      const maxScrollLeft = 0;
      const minScrollLeft = -((totalCards * cardWidth) - containerWidth);
      
      let adjustedScroll = newScrollLeft;
      if (newScrollLeft > maxScrollLeft) {
        adjustedScroll = maxScrollLeft + (newScrollLeft - maxScrollLeft) * 0.3;
      } else if (newScrollLeft < minScrollLeft) {
        adjustedScroll = minScrollLeft + (newScrollLeft - minScrollLeft) * 0.3;
      }
      
      jobContainer.css('transform', `translateX(${adjustedScroll}px)`);
    }
  });
  
  jobContainer.on('touchend touchcancel', function(e) {
    if (!isMouseDown) return;
    
    isMouseDown = false;
    jobContainer.removeClass('grabbing');
    jobContainer.css('transition', 'transform 0.3s ease-out');
    
    if (isDragging) {
      const touch = e.originalEvent.changedTouches[0];
      const walkDistance = touch.pageX - startX;
      
      if (Math.abs(walkDistance) > cardWidth * 0.2) {
        if (walkDistance > 0 && currentSlide > 0) {
          currentSlide--;
        } else if (walkDistance < 0 && currentSlide < totalSlides - 1) {
          currentSlide++;
        }
      }
      
      goToSlide(currentSlide);
      
      setTimeout(function() {
        isDragging = false;
      }, 100);
    } else {
      goToSlide(currentSlide);
    }
    
    startAutoplay();
  });
  
  // インジケーターのクリックイベント
  indicators.on('click', function() {
    const slideIndex = $(this).index();
    goToSlide(slideIndex);
  });
  
  // 自動再生
  let autoplayInterval;
  
  function startAutoplay() {
    stopAutoplay();
    
    autoplayInterval = setInterval(function() {
      if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(0);
      }
    }, 5000); // 5秒ごとに次のスライドへ
  }
  
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }
  
  // ウィンドウリサイズ時の処理
  $(window).on('resize', function() {
    // リサイズ中に何度も処理しないようタイマー設定
    clearTimeout(window.resizedFinished);
    window.resizedFinished = setTimeout(function() {
      // サイズ変更後に再計算
      const newCardWidth = jobCards.first().outerWidth(true);
      const newContainerWidth = jobSliderWrapper.width();
      const newCardsPerView = Math.max(1, Math.floor(newContainerWidth / newCardWidth));
      
      // 現在のスライドに再配置
      goToSlide(currentSlide);
    }, 250);
  });
  
  
  
  // 初期化
  goToSlide(0);
  startAutoplay();
});

/**
 * 求人詳細ページのスライドショー用JavaScript
 * 複数のサムネイル画像をスライドショー表示する機能を実装
 */
jQuery(document).ready(function($) {
    // スライドショー用の変数
    const slideshowContainer = $('.slideshow');
    let currentSlide = 0;
    let slideInterval;
    let slideshowImages = [];
    let isHovering = false;
    
    // 求人詳細ページにPHPで出力された全ての画像を取得
    slideshowImages = $('.slideshow img').toArray();
    
    // 画像が複数ある場合のみスライドショー機能を設定
    if (slideshowImages.length > 1) {
        // 最初の画像以外を非表示にする
        $(slideshowImages).hide();
        $(slideshowImages[0]).show();
        
        // ナビゲーションドットを作成
        createNavigationDots();
        
        // 前後の切り替えボタンを作成
        createNavigationButtons();
        
        // 自動スライドショーを開始
        startSlideshow();
        
        // ホバー時にスライドショーを一時停止
        slideshowContainer.hover(
            function() {
                isHovering = true;
                stopSlideshow();
            },
            function() {
                isHovering = false;
                startSlideshow();
            }
        );
    }
    
    /**
     * スライドショー用のナビゲーションドットを作成
     */
    function createNavigationDots() {
        const dotsContainer = $('<div class="slideshow-dots"></div>');
        
        // 画像の数に基づいてドットを作成
        for (let i = 0; i < slideshowImages.length; i++) {
            const dot = $('<span class="slideshow-dot"></span>');
            
            // 最初のドットをアクティブに
            if (i === 0) {
                dot.addClass('active');
            }
            
            // 各ドットにクリックイベントを追加
            dot.on('click', function() {
                goToSlide(i);
            });
            
            dotsContainer.append(dot);
        }
        
        // スライドショーの中にドットコンテナを追加（重要な変更点）
        slideshowContainer.append(dotsContainer);
    }
    
    /**
     * 前へ・次へのナビゲーションボタンを作成
     */
    function createNavigationButtons() {
        // 前へボタン
        const prevButton = $('<button class="slideshow-nav prev" aria-label="前の画像へ">&lt;</button>');
        prevButton.on('click', function() {
            goToSlide(currentSlide - 1);
        });
        
        // 次へボタン
        const nextButton = $('<button class="slideshow-nav next" aria-label="次の画像へ">&gt;</button>');
        nextButton.on('click', function() {
            goToSlide(currentSlide + 1);
        });
        
        // スライドショーコンテナにボタンを追加
        slideshowContainer.append(prevButton, nextButton);
    }
    
    /**
     * 自動スライドショーを開始
     */
    function startSlideshow() {
        // まだ実行中でなく、ホバー中でもない場合のみ開始
        if (!slideInterval && !isHovering) {
            slideInterval = setInterval(function() {
                goToSlide(currentSlide + 1);
            }, 5000); // 5秒ごとに画像を切り替え
        }
    }
    
    /**
     * スライドショーを停止
     */
    function stopSlideshow() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    /**
     * 特定のスライドに移動
     */
    function goToSlide(slideIndex) {
        // 最後のスライドを超えたら最初に戻る
        if (slideIndex >= slideshowImages.length) {
            slideIndex = 0;
        }
        // 最初のスライドより前に戻ったら最後のスライドに移動
        else if (slideIndex < 0) {
            slideIndex = slideshowImages.length - 1;
        }
        
        // 現在表示されているスライドを非表示に
        $(slideshowImages[currentSlide]).fadeOut(400);
        
        // 新しいスライドを表示
        $(slideshowImages[slideIndex]).fadeIn(400);
        
        // アクティブドットを更新
        $('.slideshow-dot').removeClass('active');
        $('.slideshow-dot').eq(slideIndex).addClass('active');
        
        // 現在のスライドインデックスを更新
        currentSlide = slideIndex;
        
        // 自動スライドショーを再開
        stopSlideshow();
        startSlideshow();
    }
});

/**
 * ハンバーガーメニュー用JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    // ハンバーガーメニューの要素を取得
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    
    // ハンバーガーメニューがクリックされたときの処理
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            // メニューの開閉状態を切り替え
            hamburgerMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            
            // メニューが開いているときは背景スクロールを無効化
            if (mobileMenu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }
    
    // オーバーレイがクリックされたときの処理
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function() {
            // メニューを閉じる
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = '';
        });
    }
    
    // リサイズイベントの処理
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            // PC表示に切り替わったときにメニューを閉じる
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // モバイルメニュー内のリンクがクリックされたときの処理
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav a, .mobile-user-nav a');
    mobileMenuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // メニューを閉じる
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = '';
        });
    });
});

