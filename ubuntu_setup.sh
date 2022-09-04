# locale-gen "en_US.UTF-8"
# update-locale LANG=en_US.utf8
# update-locale LC_ALL=en_US.utf8
# reboot
apt -y update
apt -y upgrade
apt -y install git redis-server python3-pip libenchant1c2a ffmpeg tmux nginx snapd ufw gpg-agent htop

git config --global credential.helper store
cd /rDrama
cp ./env /env
sed -i 's/^/export /g;s/=/="/g;s/$/"/g' /env
. /env

cp ./startup.sh /s
cp ./startup_chat.sh /s2

sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt -y update
apt -y install postgresql-14
sudo rm /etc/postgresql/14/main/pg_hba.conf
sudo cp pg_hba.conf /etc/postgresql/14/main/pg_hba.conf
service postgresql restart
chown postgres:postgres /etc/postgresql/14/main/pg_hba.conf

sudo rm /etc/nginx/sites-available -r
sudo rm /etc/nginx/sites-enabled/default
sudo cp nginx.txt /etc/nginx/sites-enabled/1

psql -U postgres -f schema.sql postgres
psql -U postgres -f seed-db.sql postgres
pip3 install -r requirements.txt
mkdir /songs
mkdir /images
mkdir /videos
mkdir /audio
git config --global --add safe.directory /songs
git config --global --add safe.directory /images
git config --global --add safe.directory /videos
git config --global --add safe.directory /audio
snap install opera-proxy
ufw allow ssh
ufw allow from 173.245.48.0/20
ufw allow from 103.21.244.0/22
ufw allow from 103.22.200.0/22
ufw allow from 103.31.4.0/22
ufw allow from 141.101.64.0/18
ufw allow from 108.162.192.0/18
ufw allow from 190.93.240.0/20
ufw allow from 188.114.96.0/20
ufw allow from 197.234.240.0/22
ufw allow from 198.41.128.0/17
ufw allow from 162.158.0.0/15
ufw allow from 104.16.0.0/13
ufw allow from 104.24.0.0/14
ufw allow from 172.64.0.0/13
ufw allow from 131.0.72.0/22
echo "y" | ufw enable
curl https://rclone.org/install.sh | bash
echo "psql -U postgres" > /p
echo "tmux -S /tmp/s a -t 0" > /c
echo "tmux -S /tmp/s a -t 1" > /c2
echo "cd /rDrama && git pull" > /g
echo '{"Bots": true, "Fart mode": false, "Read-only mode": false, "Signups": true, "login_required": false}' > /site_settings.json
. imei.sh