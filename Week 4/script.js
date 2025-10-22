class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio-player');
        this.playlist = [];
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isRepeating = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadDemoSongs();
    }

    initializeElements() {
        // Control buttons
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.mainPlayBtn = document.getElementById('main-play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        // Progress elements
        this.progressSlider = document.getElementById('progress-slider');
        this.progressBar = document.getElementById('progress');
        this.currentTimeSpan = document.getElementById('current-time');
        this.durationSpan = document.getElementById('duration');
        
        // Volume control
        this.volumeSlider = document.getElementById('volume-slider');
        
        // Song info elements
        this.songTitle = document.getElementById('song-title');
        this.songArtist = document.getElementById('song-artist');
        this.albumImage = document.getElementById('album-image');
        
        // Playlist elements
        this.playlistElement = document.getElementById('playlist');
        this.fileInput = document.getElementById('file-input');
        
        // Set initial volume
        this.audio.volume = 0.7;
    }

    bindEvents() {
        // Play/pause buttons
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.mainPlayBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        
        // Progress slider
        this.progressSlider.addEventListener('input', () => this.seekTo());
        
        // Volume slider
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        
        // File input
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextSong());
        this.audio.addEventListener('loadstart', () => this.showLoading());
        this.audio.addEventListener('canplay', () => this.hideLoading());
    }

    loadDemoSongs() {
        // Add some demo songs (these are placeholder URLs - in a real app you'd have actual audio files)
        const demoSongs = [
            {
                title: "Sample Song 1",
                artist: "Demo Artist",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                image: "https://via.placeholder.com/300x300/667eea/ffffff?text=Song+1"
            },
            {
                title: "Sample Song 2", 
                artist: "Demo Artist",
                src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
                image: "https://via.placeholder.com/300x300/764ba2/ffffff?text=Song+2"
            }
        ];

        // Note: Demo songs use placeholder audio. Users can upload their own files.
        this.playlist = demoSongs;
        this.renderPlaylist();
        
        if (this.playlist.length > 0) {
            this.loadSong(0);
        }
    }

    handleFileUpload(event) {
        const files = Array.from(event.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('audio/')) {
                const song = {
                    title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                    artist: "Unknown Artist",
                    src: URL.createObjectURL(file),
                    image: "https://via.placeholder.com/300x300/667eea/ffffff?text=Audio+File",
                    file: file
                };
                
                this.playlist.push(song);
            }
        });
        
        this.renderPlaylist();
        
        // If this is the first song, load it
        if (this.playlist.length === files.length) {
            this.loadSong(0);
        }
    }

    renderPlaylist() {
        this.playlistElement.innerHTML = '';
        
        this.playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            li.innerHTML = `
                <div class="song-details">
                    <div class="song-name">${song.title}</div>
                    <div class="song-duration">${song.artist}</div>
                </div>
                <i class="fas fa-play play-icon"></i>
            `;
            
            li.addEventListener('click', () => this.loadSong(index));
            this.playlistElement.appendChild(li);
        });
        
        this.updateActivePlaylistItem();
    }

    loadSong(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentSongIndex = index;
        const song = this.playlist[index];
        
        this.audio.src = song.src;
        this.songTitle.textContent = song.title;
        this.songArtist.textContent = song.artist;
        this.albumImage.src = song.image;
        
        this.updateActivePlaylistItem();
        
        // Reset progress
        this.progressSlider.value = 0;
        this.progressBar.style.width = '0%';
        this.currentTimeSpan.textContent = '0:00';
    }

    togglePlayPause() {
        if (this.playlist.length === 0) return;
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    previousSong() {
        const prevIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.playlist.length - 1;
        this.loadSong(prevIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    nextSong() {
        const nextIndex = this.currentSongIndex < this.playlist.length - 1 ? this.currentSongIndex + 1 : 0;
        this.loadSong(nextIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    seekTo() {
        const seekTime = (this.progressSlider.value / 100) * this.audio.duration;
        this.audio.currentTime = seekTime;
    }

    setVolume() {
        this.audio.volume = this.volumeSlider.value / 100;
    }

    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressSlider.value = progress;
            this.progressBar.style.width = progress + '%';
            
            this.currentTimeSpan.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    updateDuration() {
        if (this.audio.duration) {
            this.durationSpan.textContent = this.formatTime(this.audio.duration);
        }
    }

    updatePlayButton() {
        const playIcon = this.isPlaying ? 'fa-pause' : 'fa-play';
        this.playPauseBtn.innerHTML = `<i class="fas ${playIcon}"></i>`;
        this.mainPlayBtn.innerHTML = `<i class="fas ${playIcon}"></i>`;
    }

    updateActivePlaylistItem() {
        const items = this.playlistElement.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index === this.currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showLoading() {
        // You can add loading indicator here
        console.log('Loading...');
    }

    hideLoading() {
        // Hide loading indicator here
        console.log('Loaded');
    }
}

// Initialize the music player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        const player = window.musicPlayer || new MusicPlayer();
        player.togglePlayPause();
    }
});

// Prevent default drag and drop behavior and add visual feedback
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    document.body.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
});

document.addEventListener('dragleave', (e) => {
    if (e.clientX === 0 && e.clientY === 0) {
        document.body.style.backgroundColor = '';
    }
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    document.body.style.backgroundColor = '';
    
    const files = Array.from(e.dataTransfer.files);
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    
    if (audioFiles.length > 0) {
        const fileInput = document.getElementById('file-input');
        const dt = new DataTransfer();
        audioFiles.forEach(file => dt.items.add(file));
        fileInput.files = dt.files;
        
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
    }
});
