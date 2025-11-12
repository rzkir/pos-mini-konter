import { View, Text, ScrollView, TouchableOpacity } from 'react-native'

import { router } from 'expo-router'

import { Ionicons } from '@expo/vector-icons'

import HeaderGradient from '@/components/ui/HeaderGradient'

export default function SyaratDanKetentuan() {
    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <HeaderGradient
                colors={['#FF9228', '#FF9228']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                title="Syarat dan Ketentuan"
                icon="📄"
            >
                <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-3xl font-bold text-white mb-2">
                            Syarat dan Ketentuan
                        </Text>
                        <Text className="text-blue-100 text-base">
                            Ketentuan penggunaan aplikasi Kasir Mini
                        </Text>
                    </View>
                    <TouchableOpacity
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </HeaderGradient>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >
                <View className="px-4 py-6">
                    {/* Last Updated */}
                    <View className="bg-card rounded-2xl p-4 mb-4 border border-border">
                        <Text className="text-gray-500 text-sm">
                            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Text>
                    </View>

                    {/* Introduction */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            1. Penerimaan Syarat
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-700 leading-6">
                                Dengan mengunduh, menginstal, atau menggunakan aplikasi Kasir Mini, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan ketentuan ini, harap jangan gunakan aplikasi ini.
                            </Text>
                        </View>
                    </View>

                    {/* Description of Service */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            2. Deskripsi Layanan
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6 mb-3">
                                Kasir Mini adalah aplikasi Point of Sale (POS) yang menyediakan fitur:
                            </Text>
                            <Text className="text-gray-600 leading-6">
                                • Manajemen transaksi penjualan{'\n'}
                                • Pengelolaan inventori dan produk{'\n'}
                                • Pembuatan laporan bisnis{'\n'}
                                • Scan barcode untuk input cepat{'\n'}
                                • Pencetakan struk transaksi{'\n'}
                                • Manajemen pelanggan dan supplier{'\n\n'}
                                Kami berhak untuk mengubah, menangguhkan, atau menghentikan layanan kapan saja tanpa pemberitahuan sebelumnya.
                            </Text>
                        </View>
                    </View>

                    {/* Account Registration */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            3. Pendaftaran Akun
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-700 font-semibold mb-3">
                                3.1 Kewajiban Pengguna
                            </Text>
                            <Text className="text-gray-600 leading-6 mb-4">
                                • Anda harus berusia minimal 18 tahun atau memiliki izin dari wali untuk menggunakan aplikasi{'\n'}
                                • Informasi yang Anda berikan harus akurat dan terkini{'\n'}
                                • Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun Anda{'\n'}
                                • Anda bertanggung jawab atas semua aktivitas yang terjadi di akun Anda
                            </Text>

                            <Text className="text-gray-700 font-semibold mb-3">
                                3.2 Larangan
                            </Text>
                            <Text className="text-gray-600 leading-6">
                                • Membagikan kredensial akun kepada pihak lain{'\n'}
                                • Menggunakan akun untuk tujuan ilegal{'\n'}
                                • Mencoba mengakses akun pengguna lain{'\n'}
                                • Melakukan aktivitas yang merugikan sistem atau pengguna lain
                            </Text>
                        </View>
                    </View>

                    {/* Acceptable Use */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            4. Penggunaan yang Diizinkan
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-700 font-semibold mb-3">
                                Anda setuju untuk TIDAK:
                            </Text>
                            <Text className="text-gray-600 leading-6">
                                • Menggunakan aplikasi untuk tujuan ilegal atau tidak sah{'\n'}
                                • Melanggar hukum atau peraturan yang berlaku{'\n'}
                                • Menginfeksi aplikasi dengan virus, malware, atau kode berbahaya{'\n'}
                                • Mencoba membongkar, merekayasa balik, atau menyalin kode aplikasi{'\n'}
                                • Mengganggu atau mengganggu operasi aplikasi{'\n'}
                                • Menggunakan bot, script, atau alat otomatis untuk mengakses aplikasi{'\n'}
                                • Menyalahgunakan fitur aplikasi dengan cara yang tidak dimaksudkan
                            </Text>
                        </View>
                    </View>

                    {/* Intellectual Property */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            5. Kekayaan Intelektual
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                • Semua hak kekayaan intelektual dalam aplikasi (termasuk logo, desain, kode, dan konten) adalah milik Kasir Mini atau pemberi lisensinya{'\n'}
                                • Anda tidak diperbolehkan untuk menyalin, memodifikasi, atau mendistribusikan aplikasi tanpa izin tertulis{'\n'}
                                • Konten yang Anda input ke dalam aplikasi tetap menjadi milik Anda, namun Anda memberikan lisensi kepada kami untuk menggunakan data tersebut untuk menyediakan layanan{'\n'}
                                • Kami menghormati hak kekayaan intelektual pihak lain dan mengharapkan hal yang sama dari pengguna
                            </Text>
                        </View>
                    </View>

                    {/* Payment Terms */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            6. Ketentuan Pembayaran
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                • Jika aplikasi menawarkan fitur berbayar, pembayaran harus dilakukan sesuai dengan ketentuan yang berlaku{'\n'}
                                • Harga dapat berubah sewaktu-waktu dengan pemberitahuan sebelumnya{'\n'}
                                • Semua pembayaran bersifat final dan tidak dapat dikembalikan kecuali diatur secara eksplisit{'\n'}
                                • Anda bertanggung jawab untuk membayar semua pajak yang berlaku
                            </Text>
                        </View>
                    </View>

                    {/* Data and Privacy */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            7. Data dan Privasi
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                • Penggunaan data Anda diatur oleh Kebijakan Privasi kami{'\n'}
                                • Kami melakukan backup data Anda secara berkala, namun Anda disarankan untuk melakukan backup sendiri{'\n'}
                                • Kami tidak bertanggung jawab atas kehilangan data yang disebabkan oleh kegagalan perangkat atau tindakan Anda{'\n'}
                                • Anda memberikan izin kepada kami untuk menggunakan data anonim untuk tujuan analitik dan peningkatan layanan
                            </Text>
                        </View>
                    </View>

                    {/* Limitation of Liability */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            8. Batasan Tanggung Jawab
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-700 font-semibold mb-3">
                                8.1 Disclaimer
                            </Text>
                            <Text className="text-gray-600 leading-6 mb-4">
                                Aplikasi disediakan &quot;apa adanya&quot; tanpa jaminan apa pun, baik tersurat maupun tersirat. Kami tidak menjamin bahwa:
                            </Text>
                            <Text className="text-gray-600 leading-6 mb-4">
                                • Aplikasi akan selalu tersedia atau bebas dari error{'\n'}
                                • Hasil yang diperoleh dari penggunaan aplikasi akan akurat atau dapat diandalkan{'\n'}
                                • Semua bug akan diperbaiki dengan segera
                            </Text>

                            <Text className="text-gray-700 font-semibold mb-3">
                                8.2 Batasan Tanggung Jawab
                            </Text>
                            <Text className="text-gray-600 leading-6">
                                Kami tidak bertanggung jawab atas:{'\n\n'}
                                • Kerugian langsung, tidak langsung, atau konsekuensial yang timbul dari penggunaan aplikasi{'\n'}
                                • Kehilangan data, keuntungan, atau peluang bisnis{'\n'}
                                • Kegagalan sistem atau gangguan layanan{'\n'}
                                • Tindakan pihak ketiga yang mempengaruhi penggunaan aplikasi
                            </Text>
                        </View>
                    </View>

                    {/* Indemnification */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            9. Ganti Rugi
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                Anda setuju untuk mengganti kerugian, membela, dan membebaskan Kasir Mini, afiliasinya, dan para pekerjanya dari segala klaim, kerugian, kerusakan, kewajiban, dan biaya (termasuk biaya hukum yang wajar) yang timbul dari atau terkait dengan:
                            </Text>
                            <Text className="text-gray-600 leading-6 mt-3">
                                • Pelanggaran terhadap Syarat dan Ketentuan ini{'\n'}
                                • Penggunaan yang tidak sah atau menyalahgunakan aplikasi{'\n'}
                                • Pelanggaran hak pihak ketiga
                            </Text>
                        </View>
                    </View>

                    {/* Termination */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            10. Pengakhiran
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                • Kami berhak untuk menangguhkan atau mengakhiri akses Anda ke aplikasi kapan saja, dengan atau tanpa alasan{'\n'}
                                • Anda dapat menghentikan penggunaan aplikasi kapan saja dengan menghapus aplikasi dari perangkat Anda{'\n'}
                                • Setelah pengakhiran, hak Anda untuk menggunakan aplikasi akan berakhir segera{'\n'}
                                • Ketentuan yang menurut sifatnya harus bertahan akan tetap berlaku setelah pengakhiran
                            </Text>
                        </View>
                    </View>

                    {/* Changes to Terms */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            11. Perubahan Syarat
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                • Kami berhak untuk mengubah Syarat dan Ketentuan ini dari waktu ke waktu{'\n'}
                                • Perubahan akan diberitahukan melalui aplikasi atau email{'\n'}
                                • Penggunaan aplikasi setelah perubahan berarti Anda menerima syarat yang diperbarui{'\n'}
                                • Jika Anda tidak setuju dengan perubahan, Anda harus berhenti menggunakan aplikasi
                            </Text>
                        </View>
                    </View>

                    {/* Governing Law */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            12. Hukum yang Berlaku
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul dari atau terkait dengan Syarat dan Ketentuan ini akan diselesaikan melalui pengadilan yang berwenang di Indonesia.
                            </Text>
                        </View>
                    </View>

                    {/* Severability */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            13. Ketentuan Terpisah
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                Jika ada ketentuan dalam dokumen ini yang dianggap tidak valid atau tidak dapat dilaksanakan, ketentuan tersebut akan diubah dan ditafsirkan untuk mencapai tujuan ketentuan tersebut dalam batas maksimum yang diizinkan oleh hukum yang berlaku.
                            </Text>
                        </View>
                    </View>

                    {/* Contact */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            14. Hubungi Kami
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6 mb-4">
                                Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami:
                            </Text>

                            <View className="bg-gray-50 rounded-xl p-4">
                                <View className="flex-row items-center mb-3">
                                    <Ionicons name="mail" size={20} color="#3b82f6" />
                                    <Text className="text-gray-700 ml-3">Email: spacedigitalia@gmail.com</Text>
                                </View>
                                <View className="flex-row items-center mb-3">
                                    <Ionicons name="call" size={20} color="#10b981" />
                                    <Text className="text-gray-700 ml-3">Telepon: +62 813 9863 2939</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Ionicons name="globe" size={20} color="#8b5cf6" />
                                    <Text className="text-gray-700 ml-3">Website: https://kasirmini.biz.id</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="mb-6">
                        <View className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-border">
                            <Text className="text-gray-700 text-center leading-6">
                                Dengan menggunakan aplikasi Kasir Mini, Anda mengakui bahwa Anda telah membaca, memahami, dan menyetujui Syarat dan Ketentuan ini.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

