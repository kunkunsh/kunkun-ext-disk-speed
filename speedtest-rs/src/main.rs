use std::fs::File;
use std::io::{self, BufReader, Read};
use std::time::{Instant, Duration};
use std::path::Path;
use std::fs;

fn copy_file(src: &Path, dst: &Path) -> io::Result<()> {
    fs::copy(src, dst)?;
    Ok(())
}

fn read_file_speed_test(path: &Path) -> io::Result<(u64, Duration)> {
    let file = File::open(path)?;
    let file_size = file.metadata()?.len();
    let mut reader = BufReader::with_capacity(1024 * 1024, file); // 1MB buffer
    
    let mut buffer = [0; 1024 * 1024]; // 1MB chunks
    let mut total_read = 0;
    
    let start = Instant::now();
    
    loop {
        match reader.read(&mut buffer)? {
            0 => break, // EOF
            bytes_read => {
                total_read += bytes_read as u64;
            }
        }
    }
    
    let duration = start.elapsed();
    
    Ok((total_read, duration))
}

fn format_size(bytes: u64) -> String {
    const KB: u64 = 1024;
    const MB: u64 = KB * 1024;
    const GB: u64 = MB * 1024;
    
    if bytes >= GB {
        format!("{:.2} GB", bytes as f64 / GB as f64)
    } else if bytes >= MB {
        format!("{:.2} MB", bytes as f64 / MB as f64)
    } else if bytes >= KB {
        format!("{:.2} KB", bytes as f64 / KB as f64)
    } else {
        format!("{} bytes", bytes)
    }
}

fn main() {
    let source_path = Path::new("/Users/hk/Dev/kunkun-extension-repos/disk-speed/test.txt");
    let copied_path = Path::new("/Users/hk/Dev/kunkun-extension-repos/disk-speed/test_copy.txt");
    
    println!("Copying file to: {}", copied_path.display());
    
    match copy_file(source_path, copied_path) {
        Ok(_) => {
            println!("Starting disk read speed test on copied file: {}", copied_path.display());
            
            match read_file_speed_test(copied_path) {
                Ok((bytes_read, duration)) => {
                    let size = format_size(bytes_read);
                    let seconds = duration.as_secs_f64();
                    let speed = bytes_read as f64 / seconds / (1024.0 * 1024.0);
                    
                    println!("Read {} in {:.2} seconds", size, seconds);
                    println!("Read speed: {:.2} MB/s", speed);
                    
                    // Clean up the copied file
                    if let Err(e) = fs::remove_file(copied_path) {
                        eprintln!("Error removing temporary file: {}", e);
                    }
                },
                Err(e) => {
                    eprintln!("Error testing read speed: {}", e);
                }
            }
        },
        Err(e) => {
            eprintln!("Error copying file: {}", e);
        }
    }
}
