const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'VM_PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const progressCover = $('.progress-cover');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'À Lôi',
            singer: 'Double2T',
            path: './assets/music/Aloi.mp3',
            image: './assets/image/aloi.jpg'
        },
        {
            name: 'Ăn Sáng Nha',
            singer: 'ERIK, Suni Ha Linh',
            path: './assets/music/AnSangNha.mp3',
            image: './assets/image/anSangNha.jpg'
        },
        {
            name: 'Côn Đồ Trên Con Đò',
            singer: 'Dat Maniac',
            path: './assets/music/ConDoTrenConDo.mp3',
            image: './assets/image/conDoTrenConDo.jpg'
        },
        {
            name: 'Internet Love',
            singer: 'Obito, HNgan',
            path: './assets/music/InternetLove.mp3',
            image: './assets/image/internetLove.jpg'
        },
        {
            name: 'Không Sao Mà Em Đây Rồi',
            singer: 'Suni Ha Linh, Lou Hoang',
            path: './assets/music/KhongSaoMaNocDayRoi.mp3',
            image: './assets/image/khongSaoMaEmDayRoi.jpg'
        },
        {
            name: 'Một Mình Có Buồn Không',
            singer: 'Thieu Bao Tram',
            path: './assets/music/MMCBK.mp3',
            image: './assets/image/motMinhCoBuonKhong.jpg'
        },
        {
            name: 'Rap Chậm Thôi',
            singer: 'MCK',
            path: './assets/music/RapChamThoi.mp3',
            image: './assets/image/RapChamThoi.jpg'
        },
        {
            name: 'Simp Gái 808',
            singer: 'Low G',
            path: './assets/music/SimpGai808.mp3',
            image: './assets/image/simpGai808.jpg'
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                `
        });
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        //xu ly CD quay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 50000, //10s
            iteration: Infinity
        })
        cdThumbAnimate.pause()

        //Xu ly phong to/ thu nho CD
        document.onscroll = function () {
            const scrollTop = window.scrollTop || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xu ly khi click button Play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        //khi song duoc play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //khi song bi pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            // if (audio.duration) {
            //     const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            //     progress.value = progressPercent
            // }

            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
                progressCover.style.width = progressPercent + '%';
            }
        }
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
            progressCover.style.width = e.target.value + '%';
        };

        //xu ly khi tua bai hat
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //khi next bai hat
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //khi prev bai hat
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        //xu ly bat/tat random bai hat
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //xu ly repeat bai hat
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //xu ly next bai hat khi audio Ended(khi bai hat ket thuc)
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        //Lang nghe hanh vi click vao playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                //Xu ly khi click vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }

                //Xu ly khi click vao option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300)
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        // console.log(heading, cdThumb, audio)
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    //*/*/************** */
    // updateProgress: function () {
    //     const progressBar = document.querySelector('#progress::before');
    //     if (progressBar) {
    //         progressBar.style.width = `${progress.value}%`;
    //     }
    // },

    start: function () {
        //Gan cau hinh tu config vao ung dung
        this.loadConfig()

        // Dinh nghia cac thuoc tinh cho object
        this.defineProperties()

        //Lang nghe, xu ly cac su kien (DOM events)
        this.handleEvents()

        //tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()

        //render playlist
        this.render()

        //hien thi trang thai ban dau cua button 
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start()