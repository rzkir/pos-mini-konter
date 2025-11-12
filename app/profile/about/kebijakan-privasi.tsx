import { View, Text, ScrollView, TouchableOpacity } from 'react-native'

import { router } from 'expo-router'

import { Ionicons } from '@expo/vector-icons'

import HeaderGradient from '@/components/ui/HeaderGradient'

export default function KebijakanPrivasi() {
    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <HeaderGradient
                colors={['#FF9228', '#FF9228']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                title="Kebijakan Privasi"
                icon="🔒"
            >
                <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-3xl font-bold text-white mb-2">
                            Kebijakan Privasi
                        </Text>
                        <Text className="text-blue-100 text-base">
                            Perlindungan data dan privasi pengguna
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
                <View className="px-4 mt-4 mb-4">
                    {/* Last Updated */}
                    <View className="bg-card rounded-2xl p-4 mb-4 border border-border">
                        <Text className="text-gray-500 text-sm">
                            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Text>
                    </View>

                    {/* Introduction */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            1. Pendahuluan
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-700 leading-6">
                                Kasir Mini menghormati privasi Anda dan berkomitmen untuk melindungi informasi pribadi yang Anda berikan kepada kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda ketika menggunakan aplikasi Kasir Mini.
                            </Text>
                        </View>
                    </View>

                    {/* Data Collection */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            2. Informasi yang Kami Kumpulkan
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-700 font-semibold mb-3">
                                2.1 Informasi yang Anda Berikan
                            </Text>
                            <Text className="text-gray-600 leading-6 mb-4">
                                • Informasi profil bisnis (nama toko, alamat, kontak){'\n'}
                                • Data produk dan inventori{'\n'}
                                • Informasi transaksi dan penjualan{'\n'}
                                • Data pelanggan (opsional){'\n'}
                                • Informasi akun pengguna
                            </Text>

                            <Text className="text-gray-700 font-semibold mb-3">
                                2.2 Informasi yang Dikumpulkan Secara Otomatis
                            </Text>
                            <Text className="text-gray-600 leading-6">
                                • Informasi perangkat (model, sistem operasi, versi){'\n'}
                                • Log aktivitas dalam aplikasi{'\n'}
                                • Informasi lokasi (jika diizinkan){'\n'}
                                • Data penggunaan aplikasi
                            </Text>
                        </View>
                    </View>

                    {/* How We Use Data */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            3. Bagaimana Kami Menggunakan Informasi
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                Kami menggunakan informasi yang dikumpulkan untuk:{'\n\n'}
                                • Menyediakan dan meningkatkan layanan aplikasi{'\n'}
                                • Memproses transaksi dan pembayaran{'\n'}
                                • Mengelola inventori dan produk{'\n'}
                                • Menghasilkan laporan bisnis{'\n'}
                                • Memberikan dukungan pelanggan{'\n'}
                                • Mengirim notifikasi penting terkait aplikasi{'\n'}
                                • Mencegah penipuan dan aktivitas mencurigakan{'\n'}
                                • Mematuhi kewajiban hukum
                            </Text>
                        </View>
                    </View>

                    {/* Data Storage */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            4. Penyimpanan Data
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                • Data Anda disimpan secara lokal di perangkat Anda{'\n'}
                                • Backup data dapat disimpan di server kami secara terenkripsi{'\n'}
                                • Kami menggunakan teknologi keamanan modern untuk melindungi data Anda{'\n'}
                                • Data akan disimpan selama diperlukan untuk menyediakan layanan atau sesuai dengan ketentuan hukum yang berlaku
                            </Text>
                        </View>
                    </View>

                    {/* Data Sharing */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            5. Pembagian Data
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-700 font-semibold mb-3">
                                Kami tidak akan menjual atau menyewakan data pribadi Anda kepada pihak ketiga. Data hanya dapat dibagikan dalam situasi berikut:
                            </Text>
                            <Text className="text-gray-600 leading-6">
                                • Dengan persetujuan Anda{'\n'}
                                • Untuk mematuhi kewajiban hukum atau proses peradilan{'\n'}
                                • Dengan penyedia layanan yang membantu operasi aplikasi (di bawah kontrak kerahasiaan){'\n'}
                                • Dalam hal merger, akuisisi, atau penjualan aset (dengan pemberitahuan terlebih dahulu)
                            </Text>
                        </View>
                    </View>

                    {/* User Rights */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            6. Hak Anda
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                Anda memiliki hak untuk:{'\n\n'}
                                • Mengakses data pribadi Anda{'\n'}
                                • Memperbaiki data yang tidak akurat{'\n'}
                                • Menghapus data pribadi Anda{'\n'}
                                • Menolak pengolahan data tertentu{'\n'}
                                • Menarik persetujuan untuk penggunaan data{'\n'}
                                • Mengekspor data Anda dalam format yang dapat dibaca{'\n'}
                                • Mengajukan keluhan kepada otoritas perlindungan data
                            </Text>
                        </View>
                    </View>

                    {/* Security */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            7. Keamanan Data
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                Kami menerapkan berbagai langkah keamanan untuk melindungi data Anda:{'\n\n'}
                                • Enkripsi data dalam transmisi dan penyimpanan{'\n'}
                                • Kontrol akses yang ketat{'\n'}
                                • Pemantauan sistem secara berkala{'\n'}
                                • Pelatihan keamanan untuk tim kami{'\n'}
                                • Backup data yang aman dan teratur
                            </Text>
                            <Text className="text-gray-500 text-sm mt-4 italic">
                                Meskipun kami berusaha melindungi data Anda, tidak ada metode transmisi melalui internet atau penyimpanan elektronik yang 100% aman.
                            </Text>
                        </View>
                    </View>

                    {/* Cookies & Tracking */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            8. Cookies dan Teknologi Pelacakan
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                Aplikasi Kasir Mini mungkin menggunakan teknologi pelacakan untuk:{'\n\n'}
                                • Meningkatkan pengalaman pengguna{'\n'}
                                • Menganalisis penggunaan aplikasi{'\n'}
                                • Menyediakan fitur yang dipersonalisasi{'\n\n'}
                                Anda dapat mengontrol preferensi pelacakan melalui pengaturan aplikasi.
                            </Text>
                        </View>
                    </View>

                    {/* Children Privacy */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            9. Privasi Anak-Anak
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                Aplikasi Kasir Mini tidak ditujukan untuk pengguna di bawah usia 18 tahun. Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak-anak. Jika kami mengetahui bahwa seorang anak telah memberikan informasi pribadi kepada kami, kami akan menghapus informasi tersebut dari server kami.
                            </Text>
                        </View>
                    </View>

                    {/* Changes to Policy */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            10. Perubahan Kebijakan
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6">
                                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diberitahukan melalui aplikasi atau email. Penggunaan aplikasi setelah perubahan berarti Anda menerima kebijakan yang diperbarui.
                            </Text>
                        </View>
                    </View>

                    {/* Contact */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-900 mb-4">
                            11. Hubungi Kami
                        </Text>
                        <View className="bg-card rounded-2xl p-6 border border-border">
                            <Text className="text-gray-600 leading-6 mb-4">
                                Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini, silakan hubungi kami:
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
                    <View className="mb-4">
                        <View className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-border">
                            <Text className="text-gray-700 text-center leading-6">
                                Dengan menggunakan aplikasi Kasir Mini, Anda menyetujui Kebijakan Privasi ini. Terima kasih atas kepercayaan Anda.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

